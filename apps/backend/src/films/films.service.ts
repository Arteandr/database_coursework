import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../database/database.module";
import { Repository } from "../repositories/repository";
import { CreateFilmDto } from "./dto/create-film.dto";
import { FilmEntity } from "../entities/films";
import { UpdateFilmDto } from "./dto/update-film.dto";
import { Utils } from "../shared/utils";
import { DirectorsService } from "./directors/directors.service";
import { QualitiesService } from "./qualities/qualities.service";
import { StudiosService } from "./studios/studios.service";
import { faker } from "@faker-js/faker/locale/ru";

@Injectable()
export class FilmsService {
  constructor(
    @Inject(PG_CONNECTION) private readonly database: Repository,
    @Inject(DirectorsService) private readonly directorsService: DirectorsService,
    @Inject(QualitiesService) private readonly qualitiesService: QualitiesService,
    @Inject(StudiosService) private readonly studiosService: StudiosService,
  ) {
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
      `SELECT f.id           as "id",
              f.name         as "Название",
              f.description  as "Описание",
              f.photo        as "Ссылка на фото",
              f.creationyear as "Год выпуска",
              f.duration     as "Длительность",
              d.lastname     as "Фамилия режиссера",
              d.id           as "Фамилия режиссера ID",
              s.name         as "Название студии",
              s.id           as "Название студии ID",
              fq.name        as "Качество",
              fq.id          as "Качество ID"
       FROM films as f
              INNER JOIN directors as d on f.directorid = d.id
              INNER JOIN studios as s on f.studioid = s.id
              INNER JOIN film_qualities as fq on f.qualityid = fq.id
       ORDER BY f.id DESC`,
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

  async requestOnRequest() {
    const response = await this.database.query(`
      SELECT films.name          AS "Название фильма",
             directors.firstName AS "Имя режиссера",
             directors.lastName  AS "Фамилия режиссера"
      FROM films
             LEFT JOIN (SELECT id, firstName, lastName
                        FROM directors) AS directors
                       ON films.directorId = directors.id;
    `);

    return response;
  }

  async finalBySpecificValue(duration: number) {
    const response = await this.database.query(
      `
        SELECT f.duration AS "Длительность фильма",
               COUNT(*)   AS "Количество фильмов"
        FROM films f
        WHERE f.duration > $1
        GROUP BY f.duration;
      `,
      [duration],
    );

    return response;
  }

  async finalBySpecificMask(text: string) {
    text = `%${text}%`;
    const response = await this.database.query(
      `
        SELECT count(*)                                as "Количество фильмов",
               concat_ws(' ', d.firstname, d.lastname) as "Инициалы режиссера"
        FROM films
               inner join directors d on d.id = films.directorid
        WHERE films.name LIKE $1
        GROUP BY d.id;
      `,
      [text],
    );

    return response;
  }

  async finalByIndex(lastName: string) {
    const response = await this.database.query(
      `
        SELECT f.directorid                            as "Идентификатор режиссера",
               concat_ws(' ', d.firstname, d.lastname) as "Инициалы режиссера",
               COUNT(*)                                AS "Количество фильмов"
        FROM films f
               inner join directors d on d.id = f.directorid
        WHERE d.lastname = $1
        GROUP BY f.directorid, concat_ws(' ', d.firstname, d.lastname);
      `,
      [lastName],
    );

    return response;
  }

  async finalWithoutIndex(year: number) {
    const response = await this.database.query(
      `
        SELECT creationYear as "Год создания фильмов",
               COUNT(*)     AS "Количество фильмов"
        FROM films
        WHERE creationyear = $1
        GROUP BY creationYear;
      `,
      [year],
    );

    return response;
  }

  async getAllCount() {
    const response = await this.database.query(`
      SELECT count(*)       AS "Общее количество фильмов",
             f.creationyear AS "Год выпуска"
      FROM films f
      GROUP BY f.creationyear;
    `);
    console.log(response);

    return response;
  }

  async finalRequestWithInclude() {
    const response = await this.database.query(`
      SELECT count(films.id)                               as "Всего фильмов",
             count(*) filter (where duration > 60)         as "С длительностью больше часа",
             count(*) filter ( where creationyear > 2012 ) as "Созданные после 2012",
             fq.name                                       as "Качество пленки"
      FROM films
             JOIN film_qualities fq ON films.qualityid = fq.id
      GROUP BY fq.name;
    `);

    return response;
  }

  async update(id: number, dto: UpdateFilmDto) {
    const { keys, params } = Utils.MakeSetValue(dto);
    const film = (
      await this.database.query(
        `UPDATE %t
        SET ${keys} WHERE id=$1`,
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

  async requestWithIn() {
    const response = await this.database.query(
      `
        SELECT name as "Имя фильма"
        FROM films
        WHERE studioId IN (SELECT id FROM studios WHERE creationYear > 2010);
      `,
    );

    return response;
  }

  async requestWithFinalData(id: number) {
    const response = await this.database.query(
      `
        SELECT COUNT(*)                                as                             "Общее количество фильмов",
               (SELECT COUNT(*)
                FROM films
                WHERE directorId IN (SELECT id
                                     FROM directors as d
                                     WHERE d.id = $1)) as "Фильмы режиссера с ID ${id}"
        FROM films;
      `,
      [id],
    );

    return response;
  }

  async requestWithCase() {
    const response = await this.database.query(`
      SELECT name  as "Имя фильма",
             CASE
               WHEN duration > 120 THEN 'Длинный'
               WHEN duration > 60 THEN 'Средний'
               ELSE 'Короткий'
               END as "Тип длительности"
      FROM films;
    `);

    return response;
  }

  async symmetricJoinWithoutConditionFirst() {
    const response = await this.database.query(
      `
        SELECT s.id    AS "ID сеанса",
               s.date  AS "Дата сеанса",
               st.name AS "Тип сеанса"
        FROM sessions as s
               inner JOIN session_types st on s.typeid = st.id;`,
    );

    return response;
  }

  async symetricJoinWithAConditionByAForeignKey(studio_name: string) {
    const response = await this.database.query(
      `
        select F.name as "Название фильма", S.name as "Название студии"
        from films F
               inner join studios S on F.studioid = S.id
        where s.name = $1;
      `,
      [studio_name],
    );

    return response;
  }

  async symmetricWithACondByAForeignKeySecond(districtName: string) {
    const response = await this.database.query(
      `
        select c.name    as "Название кинотеатра",
               c.address as "Адрес кинотеатра",
               c.phone   as "Телефон кинотеатра",
               d.name    as "Название района"
        from cinemas c
               inner join districts d on d.id = c.districtid
        where d.name = $1;
      `,
      [districtName],
    );

    return response;
  }

  async getWithDirector(id: number) {
    const film = await this.getOne(id);
    if (!film) throw new HttpException("Такого фильма не существует", HttpStatus.NOT_FOUND);
    const response = (
      await this.database.query(
        `
          select f.id,
                 f.name,
                 f.description,
                 f.photo,
                 f.creationyear creation_year,
                 f.duration,
                 d.firstname    director_firstname,
                 d.lastname     director_lastname
          from %t f
            left outer join directors d
          on f.directorid = d.id
          WHERE f.id = $1;
        `,
        [id],
        null,
        null,
      )
    )[0];

    return response;
  }

  async generateDTO(count: number, directorIds, studioIds, qualityIds: number[]) {
    const dtos: CreateFilmDto[] = [];
    const usedNames = new Set<string>();
    (await this.getAll()).map((film) => usedNames.add(film["Название"]));
    while (dtos.length < count) {
      const dto = new CreateFilmDto({
        name: faker.lorem.words({ min: 2, max: 4 }),
        description: faker.lorem.words(10),
        photo: faker.lorem.word() + ".jpg",
        creationYear: faker.number.int({ max: 2023, min: 1990 }),
        duration: faker.number.int({ max: 10000, min: 100 }),
        directorId: Utils.GetRandomFromArray(directorIds),
        qualityId: Utils.GetRandomFromArray(qualityIds),
        studioId: Utils.GetRandomFromArray(studioIds),
      });

      if (!usedNames.has(dto.name)) {
        dtos.push(dto);
        usedNames.add(dto.name);
      }
    }

    return dtos;
  }

  async generate(count: number) {
    const directorIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const qualityIds = [1, 2, 3];
    const Z = 20103,
      N = 20004;
    const studioIds = Array.from({ length: Z - N + 1 }, (_, i) => N + i);

    if (directorIds.length < 1 || qualityIds.length < 1 || studioIds.length < 1)
      throw new HttpException("Недостаточно данных для генерации", HttpStatus.BAD_REQUEST);
    const promises = (await this.generateDTO(count, directorIds, studioIds, qualityIds)).map(
      (dto) => this.create(dto),
    );

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
