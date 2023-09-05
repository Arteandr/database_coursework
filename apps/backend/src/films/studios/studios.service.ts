import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateStudioDto } from "./dto/create-studio.dto";
import { UpdateStudioDto } from "./dto/update-studio.dto";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { StudioEntity } from "../../entities/films";
import { Utils } from "../../shared/utils";

@Injectable()
export class StudiosService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    database.tableName = "studios";
  }

  async create(dto: CreateStudioDto) {
    const studio = (
      await this.database.query(
        `INSERT INTO %t (name, creationYear, countryId)
        VALUES ($1, $2, $3)`,
        [dto.name, dto.creationYear, dto.countryId],
        StudioEntity,
      )
    )[0];

    return studio;
  }

  async getAll() {
    const studios = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      StudioEntity,
    );

    return studios;
  }

  async getOne(id: number) {
    const studio = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        StudioEntity,
      )
    )[0];

    return studio;
  }

  async update(id: number, dto: UpdateStudioDto) {
    const { params, keys } = Utils.MakeSetValue(dto);
    const studio = (
      await this.database.query(
        `UPDATE %t
        SET ${keys}
          WHERE id=$1`,
        [id].concat(params),
        StudioEntity,
      )
    )[0];
    // TODO
    if (!studio) throw new HttpException("Такой студии не существует", HttpStatus.NOT_FOUND);

    return studio;
  }

  async remove(id: number) {
    const studio = await this.getOne(id);
    if (!studio) throw new HttpException("Такой студии не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }
}
