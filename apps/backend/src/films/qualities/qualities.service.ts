import { Inject, Injectable } from "@nestjs/common";
import { NameDto } from "../../shared/dto/name.dto";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { QualityEntity } from "../../entities/films";

@Injectable()
export class QualitiesService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    this.database.tableName = "film_qualities";
  }

  async create(dto: NameDto) {
    const quality = (
      await this.database.query(
        `INSERT INTO %t (name)
        VALUES ($1)`,
        [dto.name],
        QualityEntity,
      )
    )[0];

    return quality;
  }

  async finalRequestGroupsData(count: number) {
    const response = await this.database.query(
      `
        SELECT film_qualities.name AS "Качество пленки", COUNT(*) AS "Количество фильмов"
        FROM films
               JOIN film_qualities ON films.qualityId = film_qualities.id
        WHERE films.creationYear > $1
        GROUP BY film_qualities.name;
      `,
      [count],
    );

    return response;
  }

  async getAll() {
    const qualities = await this.database.query(
      `SELECT fq.id   as "id",
              fq.name as "Название"
       FROM film_qualities fq
       ORDER BY fq.id DESC`,
    );

    return qualities;
  }

  async getOne(id: number) {
    const quality = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        QualityEntity,
      )
    )[0];

    return quality;
  }

  async update(id: number, dto: NameDto) {
    const quality = (
      await this.database.query(
        `UPDATE %t
        SET name = $1 WHERE id=$2`,
        [dto.name, id],
        QualityEntity,
      )
    )[0];

    return quality;
  }

  async remove(id: number) {
    const response = await this.database.query("DELETE FROM %t WHERE id=$1", [id]);

    return response;
  }
}
