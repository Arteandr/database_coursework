import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateSessionTypeDto } from "./dto/create-session-type.dto";
import { UpdateSessionTypeDto } from "./dto/update-session-type.dto";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { SessionTypeEntity } from "../../entities/session";
import { Utils } from "../../shared/utils";

@Injectable()
export class SessionTypesService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "session_types";
  }

  async create(dto: CreateSessionTypeDto) {
    const sessionType = (
      await this.database.query(
        `INSERT INTO %t (name, ration)
        VALUES ($1, $2)`,
        [dto.name, dto.ration],
        SessionTypeEntity,
      )
    )[0];

    return sessionType;
  }

  async getAll() {
    const sessionTypes = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      SessionTypeEntity,
    );

    return sessionTypes;
  }

  async getOne(id: number) {
    const sessionType = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        SessionTypeEntity,
      )
    )[0];

    return sessionType;
  }

  async update(id: number, dto: UpdateSessionTypeDto) {
    const { params, keys } = Utils.MakeSetValue(dto);
    const sessionType = (
      await this.database.query(
        `UPDATE %t
        SET ${keys}
          WHERE id=$1`,
        [id].concat(params),
        SessionTypeEntity,
      )
    )[0];
    // TODO
    if (!sessionType)
      throw new HttpException("Такого типа сессии не существует", HttpStatus.NOT_FOUND);

    return sessionType;
  }

  async remove(id: number) {
    const sessionType = await this.getOne(id);
    if (!sessionType)
      throw new HttpException("Такого типа сессии не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }
}
