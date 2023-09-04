import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UpdateCinemaDto } from "./dto/update-cinema.input";
import { PG_CONNECTION } from "../database/database.module";
import { Repository } from "../repositories/repository";
import { CreateCinemaDto } from "./dto/create-cinema.input";
import { CinemaEntity } from "../entities/cinema";

@Injectable()
export class CinemaService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    database.tableName = "cinemas";
  }

  async create(dto: CreateCinemaDto) {
    const cinema = (
      await this.database.query<CinemaEntity>(
        `INSERT INTO %t (name, address, phone, license, licenseEnd,
                         seats, online, typeId, districtId)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          dto.name,
          dto.address,
          dto.phone,
          dto.license,
          dto.licenseEnd,
          dto.seats,
          dto.online,
          dto.typeId,
          dto.districtId,
        ],
        CinemaEntity,
      )
    )[0];

    return cinema;
  }

  async getAll() {
    const cinemas = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      CinemaEntity,
    );

    return cinemas;
  }

  async getOne(id: number) {
    const cinema = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        CinemaEntity,
      )
    )[0];

    return cinema;
  }

  async update(id: number, dto: UpdateCinemaDto) {
    const params = [];
    const keys = Object.entries(dto).map((value, i) => {
      params.push(value[1]);
      return `${value[0]}=$${i + 2}`;
    });
    const cinema = (
      await this.database.query(
        `UPDATE %t
        SET ${keys}
          WHERE id=$1`,
        [id].concat(params),
        CinemaEntity,
      )
    )[0];
    // TODO
    if (!cinema) throw new HttpException("Такого кинотеатра не существует", HttpStatus.NOT_FOUND);

    return cinema;
  }

  async remove(id: number) {
    const cinema = await this.getOne(id);
    if (!cinema) throw new HttpException("Такого кинотеатра не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return response;
  }
}
