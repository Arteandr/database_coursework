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
      SELECT name
      FROM districts
      WHERE id NOT IN (SELECT districtId FROM cinemas);
    `);

    return response;
  }

  async getTopFilmsByDistrict(counter: number) {
    const response = await this.database.query(
      `
        SELECT cinema_name, film_name, total_tickets_sold
        FROM (SELECT c.name                                                                                     as cinema_name,
                     f.name                                                                                     as film_name,
                     SUM(s.ticketsSold + s.ticketsOnline)                                                       AS total_tickets_sold,
                     ROW_NUMBER() OVER (PARTITION BY c.name ORDER BY SUM(s.ticketsSold + s.ticketsOnline) DESC) as rn
              FROM sessions s
                     JOIN films f ON s.filmId = f.id
                     JOIN cinemas c ON s.cinemaId = c.id
              GROUP BY c.name, f.name) t
        WHERE rn <= $1;
      `,
      [counter],
    );

    return response;
  }

  async requestWithUnion() {
    const response = await this.database.query(`
    (select name from districts)
    union
    (select name from cinema_types);
    `);

    return response;
  }

  async remove(id: number) {
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return true;
  }
}
