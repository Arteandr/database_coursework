import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateDirectorDto } from "./dto/create-director.dto";
import { UpdateDirectorDto } from "./dto/update-director.dto";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { DirectorEntity } from "../../entities/films";
import { Utils } from "../../shared/utils";

@Injectable()
export class DirectorsService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "directors";
  }

  async create(dto: CreateDirectorDto) {
    const director = (
      await this.database.query(
        `INSERT INTO %t (firstName, lastName)
        VALUES ($1, $2)`,
        [dto.firstName, dto.lastName],
        DirectorEntity,
      )
    )[0];

    return director;
  }

  async getAll() {
    const directors = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      DirectorEntity,
    );

    return directors;
  }

  async getOne(id: number) {
    const director = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        DirectorEntity,
      )
    )[0];

    return director;
  }

  async requestOnRequestFinal() {
    const response = await this.database.query(`
      SELECT directors.firstName as "Имя режиссера",
             directors.lastName  as "Фамилия режиссера",
             subquery.film_count as "Количество фильмов"
      FROM directors
             INNER JOIN (SELECT directorId, COUNT(*) AS film_count
                         FROM films
                         GROUP BY directorId) AS subquery
                        ON directors.id = subquery.directorId;
    `);

    return response;
  }

  async update(id: number, dto: UpdateDirectorDto) {
    const { params, keys } = Utils.MakeSetValue(dto);
    const director = (
      await this.database.query(
        `UPDATE %t
        SET ${keys}
          WHERE id=$1`,
        [id].concat(params),
        DirectorEntity,
      )
    )[0];
    if (!director) throw new HttpException("Такого режиссера не существует", HttpStatus.NOT_FOUND);

    return director;
  }

  async remove(id: number) {
    const director = await this.getOne(id);
    if (!director) throw new HttpException("Такого режиссера не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }

  async getTotalIncome(year: number) {
    const response = await this.database.query(
      `
        SELECT d.firstName                                      as "Имя режиссера",
               d.lastName                                       as "Фамилия режиссера",
               SUM((s.ticketsSold + s.ticketsOnline) * s.price) AS "Суммарный доход",
               COUNT(s.id)                                      AS "Количество прокатов"
        FROM directors d
               JOIN
             films f ON d.id = f.directorId
               JOIN
             sessions s ON f.id = s.filmId
        WHERE EXTRACT(YEAR FROM s.date) = $1
        GROUP BY d.firstName,
                 d.lastName
        ORDER BY "Суммарный доход" DESC;
      `,
      [year],
    );

    return response;
  }
}
