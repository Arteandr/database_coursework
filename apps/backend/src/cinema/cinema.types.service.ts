import { Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../database/database.module";
import { NameDto } from "../shared/dto/name.dto";
import { Repository } from "../repositories/repository";
import { CinemaType } from "../entities/cinema";

@Injectable()
export class CinemaTypesService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "cinema_types";
  }

  async create(dto: NameDto) {
    const cinemaType = (
      await this.database.query<CinemaType>(
        `INSERT INTO %t (name) VALUES ($1)`,
        [dto.name],
        CinemaType,
      )
    )[0];

    return cinemaType;
  }

  async getAll() {
    const cinemaTypes = await this.database.query<CinemaType>(
      `SELECT * FROM %t ORDER BY id DESC`,
      null,
      CinemaType,
    );

    return cinemaTypes;
  }

  async getOne(id: number) {
    const cinemaType = (
      await this.database.query(`SELECT * FROM %t WHERE id=$1`, [id], CinemaType)
    )[0];

    return cinemaType;
  }

  async update(id: number, dto: NameDto) {
    const cinemaType = (
      await this.database.query(`UPDATE %t SET name=$1 WHERE id=$2`, [dto.name, id], CinemaType)
    )[0];

    return cinemaType;
  }

  async remove(id: number) {
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return true;
  }
}
