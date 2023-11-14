import { Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../../database/database.module";
import { NameDto } from "../../shared/dto/name.dto";
import { Repository } from "../../repositories/repository";
import { CinemaTypeEntity } from "../../entities/cinema";

@Injectable()
export class CinemaTypesService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "cinema_types";
  }

  async create(dto: NameDto) {
    const cinemaType = (
      await this.database.query<CinemaTypeEntity>(
        `INSERT INTO %t (name)
        VALUES ($1)`,
        [dto.name],
        CinemaTypeEntity,
      )
    )[0];

    return cinemaType;
  }

  async getAll() {
    const cinemaTypes = await this.database.query(
      `SELECT ct.id as "id", ct.name as "Название"
       FROM cinema_types as ct
       ORDER BY ct.id DESC`,
    );

    return cinemaTypes;
  }

  async getOne(id: number) {
    const cinemaType = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        CinemaTypeEntity,
      )
    )[0];

    return cinemaType;
  }

  async update(id: number, dto: NameDto) {
    const cinemaType = (
      await this.database.query(
        `UPDATE %t
        SET name = $1 WHERE id=$2`,
        [dto.name, id],
        CinemaTypeEntity,
      )
    )[0];

    return cinemaType;
  }

  async remove(id: number) {
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return true;
  }
}
