import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { UpdateCinemaDto } from "./dto/update-cinema.input";
import { PG_CONNECTION } from "../database/database.module";
import { Repository } from "../repositories/repository";
import { CreateCinemaDto } from "./dto/create-cinema.input";
import { CinemaEntity } from "../entities/cinema";
import { Utils } from "../shared/utils";
import { faker } from "@faker-js/faker/locale/ru";
import { DistrictService } from "./districts/district.service";
import { CinemaTypesService } from "./types/cinema.types.service";

@Injectable()
export class CinemaService {
  constructor(
    @Inject(PG_CONNECTION) private readonly database: Repository,
    @Inject(CinemaTypesService) private readonly cinemaTypesService: CinemaTypesService,
    @Inject(DistrictService) private readonly districtsService: DistrictService,
  ) {
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
    const { params, keys } = Utils.MakeSetValue(dto);
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
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }

  async finalRequestWithGroups() {
    const response = await this.database.query(`
      SELECT count(*) as including
      FROM cinemas
      group by cinemas.districtid;
    `);

    return response;
  }

  async generateDTO(count: number, typeIds, districtIds: number[]) {
    const dtos: CreateCinemaDto[] = [];
    const usedNames = new Set<string>();
    (await this.getAll()).map((film) => usedNames.add(film.name));
    while (dtos.length < count) {
      const dto = new CreateCinemaDto({
        name: faker.lorem.words({ min: 2, max: 4 }),
        address: Utils.GetRandomFromArray([
          "Донецк",
          "Москва",
          "Ереван",
          "Вроцлав",
          "Самара",
          "Омск",
        ]),
        phone: "+7949" + faker.number.int({ min: 1000000, max: 9999999 }),
        license: "№" + faker.number.int(),
        licenseEnd: faker.date.past({ years: 100 }),
        seats: Utils.GetRandomFromRange(5, 100),
        online: Utils.GetRandomFromArray([true, false]),
        typeId: Utils.GetRandomFromArray(typeIds),
        districtId: Utils.GetRandomFromArray(districtIds),
      });
      if (!usedNames.has(dto.name)) {
        dtos.push(dto);
        usedNames.add(dto.name);
      }
    }

    return dtos;
  }

  async getTopFilmsByCinema(count: number) {
    const response = await this.database.query(
      `
        SELECT c.name                               AS cinema_name,
               f.name                               AS film_name,
               SUM(s.ticketsSold + s.ticketsOnline) AS total_tickets_sold
        FROM sessions s
               JOIN
             films f ON s.filmId = f.id
               JOIN
             cinemas c ON s.cinemaId = c.id
        GROUP BY c.name, f.name
        ORDER BY total_tickets_sold DESC
        LIMIT $1;
      `,
      [count],
    );

    return response;
  }

  async generate(count: number) {
    const districtIds = (await this.districtsService.getAll()).map((district) => district.id);
    const typeIds = (await this.cinemaTypesService.getAll()).map((type) => type.id);
    if (districtIds.length < 1 || typeIds.length < 1)
      throw new HttpException("Недостаточно данных для генерации", HttpStatus.BAD_REQUEST);
    const promises = (await this.generateDTO(count, typeIds, districtIds)).map((dto) =>
      this.create(dto),
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
