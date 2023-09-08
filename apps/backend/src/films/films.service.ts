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
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      FilmEntity,
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
    (await this.getAll()).map((film) => usedNames.add(film.name));
    while (dtos.length < count) {
      const dto = new CreateFilmDto({
        name:
          faker.lorem.words({ min: 2, max: 4 }) +
          Utils.GetRandomFromArray([1, 2, 3, 4, 5, 6, 7, 8]),
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
    const directorIds = (await this.directorsService.getAll()).map((director) => director.id);
    const qualityIds = (await this.qualitiesService.getAll()).map((quality) => quality.id);
    const studioIds = (await this.studiosService.getAll()).map((studio) => studio.id);
    const promises = (await this.generateDTO(count, directorIds, studioIds, qualityIds)).map(
      (dto) => this.create(dto),
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log("ERROR");
    }
    return [];
  }
}
