import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PG_CONNECTION } from "../database/database.module";
import { Repository } from "../repositories/repository";
import { SessionEntity } from "../entities/session";
import { Utils } from "../shared/utils";

@Injectable()
export class SessionsService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "sessions";
  }

  async create(dto: CreateSessionDto) {
    const session = (
      await this.database.query(
        `INSERT INTO %t (date, ticketsSold, ticketsOnline, price, filmId, cinemaId, typeId)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          dto.date,
          dto.ticketsSold,
          dto.ticketsOnline,
          dto.price,
          dto.filmId,
          dto.cinemaId,
          dto.typeId,
        ],
        SessionEntity,
      )
    )[0];

    return session;
  }

  async getAll() {
    const sessions = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      SessionEntity,
    );

    return sessions;
  }

  async getOne(id: number) {
    const session = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        SessionEntity,
      )
    )[0];

    return session;
  }

  async update(id: number, dto: UpdateSessionDto) {
    const { params, keys } = Utils.MakeSetValue(dto);
    const session = (
      await this.database.query(
        `UPDATE %t
        SET ${keys}
          WHERE id=$1`,
        [id].concat(params),
        SessionEntity,
      )
    )[0];
    // TODO
    if (!session) throw new HttpException("Такой сессии не существует", HttpStatus.NOT_FOUND);

    return session;
  }

  async remove(id: number) {
    const session = await this.getOne(id);
    if (!session) throw new HttpException("Такой сессии не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }
}
