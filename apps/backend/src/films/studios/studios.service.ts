import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateStudioDto } from "./dto/create-studio.dto";
import { UpdateStudioDto } from "./dto/update-studio.dto";
import { PG_CONNECTION } from "../../database/database.module";
import { Repository } from "../../repositories/repository";
import { StudioEntity } from "../../entities/films";
import { Utils } from "../../shared/utils";
import { CountriesService } from "../countries/countries.service";
import { faker } from "@faker-js/faker/locale/ru";

@Injectable()
export class StudiosService {
  constructor(
    @Inject(PG_CONNECTION) private readonly database: Repository,
    @Inject(CountriesService) private readonly countryService: CountriesService,
  ) {
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
      `SELECT s.id           as "id",
              s.name         as "Название",
              s.creationyear as "Год основания",
              c.name         as "Страна основания",
              c.id           as "Страна основания ID"
       FROM studios s
              inner join countries c on c.id = s.countryid
       ORDER BY s.id DESC`,
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

  async symmetricJoinWithAConditionByADate(studioDateStart: Date, studioDateEnd: Date) {
    console.log(studioDateStart.toISOString(), studioDateEnd.toISOString());
    const response = await this.database.query(
      `
        SELECT sessions.id   as "ID сеанса",
               films.name    as "Название фильма",
               cinemas.name  as "Название кинотеатра",
               sessions.date as "Дата сеанса"
        FROM sessions
               INNER JOIN films ON sessions.filmId = films.id
               INNER JOIN cinemas ON sessions.cinemaId = cinemas.id
        WHERE sessions.date BETWEEN $1 AND $2
        ORDER BY sessions.date DESC;
      `,
      [studioDateStart.toISOString(), studioDateEnd.toISOString()],
    );

    return response;
  }

  async symmetricJoinWithoutConditionThird() {
    const response = await this.database.query(
      `
        SELECT S.name as "Название студии", C.name as "Страна"
        FROM studios S
               INNER JOIN countries C ON S.countryId = C.id;
      `,
    );

    return response;
  }

  async rightOuterJoin() {
    const response = await this.database.query(
      `
        SELECT films.name   AS "Название фильма",
               cinemas.name AS "Название кинотеатра"
        FROM films
               RIGHT JOIN sessions ON films.id = sessions.filmId
               LEFT JOIN cinemas ON sessions.cinemaId = cinemas.id;
      `,
    );

    return response;
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

  async generateDTO(count: number, countryIds: number[]) {
    const dtos: CreateStudioDto[] = [];
    const usedNames = new Set<string>();
    (await this.getAll()).map((studio) => usedNames.add(studio["Название"]));
    while (dtos.length < count) {
      const dto = new CreateStudioDto({
        name: faker.lorem.words({ min: 2, max: 4 }),
        creationYear: faker.number.int({ min: 1900, max: 2023 }),
        countryId: Utils.GetRandomFromArray(countryIds),
      });

      if (!usedNames.has(dto.name)) {
        dtos.push(dto);
        usedNames.add(dto.name);
      }
    }

    return dtos;
  }

  async generate(count: number) {
    const countryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const promises = (await this.generateDTO(count, countryIds)).map((dto) => this.create(dto));

    try {
      await Promise.all(promises);
    } catch (error) {
      throw new HttpException(
        `Произошла ошибка при генерации ${count} количества строк в таблице ${this.database.tableName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return [];
  }
}
