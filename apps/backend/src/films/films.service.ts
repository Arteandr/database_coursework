import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../database/database.module";
import { Repository } from "../repositories/repository";
import { CreateFilmDto } from "./dto/create-film.dto";
import { FilmEntity } from "../entities/films";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { Utils } from "../shared/utils";

@Injectable()
export class FilmsService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "films";
  }

  async create(dto: CreateFilmDto) {
    const film = (
      await this.database.query(
        `INSERT INTO %t (name, description, photo, creationYear, duration, directorId,
                         qualityId, studioId)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          dto.name,
          dto.description,
          dto.photo,
          dto.creationYear,
          dto.duration,
          dto.directorId,
          dto.qualityId,
          dto.studioId,
        ],
        FilmEntity,
      )
    )[0];

    return film;
  }

  async getAll() {
    const films = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      FilmEntity,
    );

    return films;
  }

  async getOne(id: number) {
    const film = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        FilmEntity,
      )
    )[0];

    return film;
  }

  async update(id: number, dto: UpdateFilmDto) {
    const { keys, params } = Utils.MakeSetValue(dto);
    const film = (
      await this.database.query(
        `UPDATE %t
        SET ${keys} WHER id=$1`,
        [id].concat(params),
        FilmEntity,
      )
    )[0];
    if (!film) throw new HttpException("Такого фильма не существует", HttpStatus.NOT_FOUND);

    return film;
  }

  async remove(id: number) {
    if (!(await this.getOne(id)))
      throw new HttpException("Такого фильма не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }
}
