import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { NameDto } from "../../shared/dto/name.dto";
import { CountryEntity } from "../../entities/films";

@Injectable()
export class CountriesService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "countries";
  }

  async create(dto: NameDto) {
    const country = (
      await this.database.query(
        `INSERT INTO %t (name)
        VALUES ($1)`,
        [dto.name],
        CountryEntity,
      )
    )[0];

    return country;
  }

  async getAll() {
    const countries = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      CountryEntity,
    );

    return countries;
  }

  async getOne(id: number) {
    const country = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        CountryEntity,
      )
    )[0];

    return country;
  }

  async update(id: number, dto: NameDto) {
    const country = (
      await this.database.query(
        `UPDATE %t
        SET name = $1 WHERE id=$2`,
        [dto.name, id],
        CountryEntity,
      )
    )[0];
    if (!country) throw new HttpException("Такой страны не существует", HttpStatus.NOT_FOUND);

    return country;
  }

  async remove(id: number) {
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return true;
  }
}
