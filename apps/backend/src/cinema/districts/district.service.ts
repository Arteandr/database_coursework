import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { NameDto } from "../../shared/dto/name.dto";
import { DistrictEntity } from "../../entities/cinema";

@Injectable()
export class DistrictService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "districts";
  }

  async create(dto: NameDto) {
    const district = (
      await this.database.query(
        `INSERT INTO %t (name)
        VALUES ($1)`,
        [dto.name],
        DistrictEntity,
      )
    )[0];

    return district;
  }

  async getAll() {
    const districts = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      DistrictEntity,
    );

    return districts;
  }

  async getOne(id: number) {
    const district = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        DistrictEntity,
      )
    )[0];

    return district;
  }

  async update(id: number, dto: NameDto) {
    const disctrict = (
      await this.database.query(
        `UPDATE %t
        SET name = $1 WHERE id=$2`,
        [dto.name, id],
        DistrictEntity,
      )
    )[0];
    if (!disctrict) throw new HttpException("Такого района не существует", HttpStatus.NOT_FOUND);

    return disctrict;
  }

  async requestWithNotIn() {
    const response = await this.database.query(`
      SELECT name "Название района"
      FROM districts
      WHERE id NOT IN (SELECT districtId FROM cinemas);
    `);

    return response;
  }

  async getTopFilmsByDistrict(counter: number) {
    // const response = await this.database.query(
    //   `
    //     SELECT cinema_name        as "Название кинотеатра",
    //            film_name          as "Название фильма",
    //            total_tickets_sold as "Количестов проданных билетов"
    //     FROM (SELECT c.name                                                                                     as cinema_name,
    //                  f.name                                                                                     as film_name,
    //                  SUM(s.ticketsSold + s.ticketsOnline)                                                       AS total_tickets_sold,
    //                  ROW_NUMBER() OVER (PARTITION BY c.name ORDER BY SUM(s.ticketsSold + s.ticketsOnline) DESC) as rn
    //           FROM sessions s
    //                  JOIN films f ON s.filmId = f.id
    //                  JOIN cinemas c ON s.cinemaId = c.id
    //           GROUP BY c.name, f.name) t
    //     WHERE rn <= $1;
    //   `,
    //   [counter],
    // );
    const response = await this.database.query(`
      WITH ranked_films AS (SELECT c.districtId,
                                   s.filmId,
                                   RANK() OVER (PARTITION BY c.districtId ORDER BY s.ticketsSold DESC) AS film_rank
                            FROM sessions s
                                   JOIN cinemas c ON s.cinemaId = c.id)
      SELECT r.districtId AS "ID района",
             d.name       AS "Название района",
             r.filmId     AS "ID фильма",
             f.name       AS "Название фильма"
      FROM ranked_films r
             JOIN districts d ON r.districtId = d.id
             JOIN films f ON r.filmId = f.id
      WHERE r.film_rank <= 5;
    `);

    return response;
  }

  async requestWithUnion() {
    const response = await this.database.query(
      `
        SELECT name AS "Название", 'Фильм' AS "Тип"
        FROM films
        UNION
        SELECT name AS "Название", 'Кинотеатр' AS "Тип"
        FROM cinemas;
      `,
    );

    return response;
  }

  async remove(id: number) {
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return true;
  }
}
