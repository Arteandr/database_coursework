import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { PG_CONNECTION } from "../database/database.module";
import { Repository } from "../repositories/repository";
import { SessionEntity } from "../entities/session";
import { Utils } from "../shared/utils";
import { SessionTypesService } from "./types/types.service";
import { FilmsService } from "../films/films.service";
import { CinemaService } from "../cinema/cinema.service";
import { fakerRU } from "@faker-js/faker";

@Injectable()
export class SessionsService {
  constructor(
    @Inject(PG_CONNECTION) private readonly database: Repository,
    @Inject(FilmsService) private readonly filmsService: FilmsService,
    @Inject(CinemaService) private readonly cinemasService: CinemaService,
    @Inject(SessionTypesService) private readonly typesService: SessionTypesService,
  ) {
    this.database.tableName = "sessions";
  }

  async create(dto: CreateSessionDto) {
    const session = (
      await this.database.query(
        `INSERT INTO %t (date, ticketsSold, ticketsOnline, price, filmId, cinemaId, typeId)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          dto.date,
          dto.ticketsSold,
          dto.ticketsOnline,
          dto.price,
          dto.filmId,
          dto.cinemaId,
          dto.typeId,
        ],
        SessionEntity,
      )
    )[0];

    return session;
  }

  async getAll() {
    const sessions = await this.database.query(
      `SELECT *
       FROM %t
       ORDER BY id DESC`,
      null,
      SessionEntity,
    );

    return sessions;
  }

  async getOne(id: number) {
    const session = (
      await this.database.query(
        `SELECT *
         FROM %t
         WHERE id=$1`,
        [id],
        SessionEntity,
      )
    )[0];

    return session;
  }

  async symmetricJoinWithoutConditionSecond() {
    const response = await this.database.query(
      `
        SELECT S.date as session_date, F.name as film_name
        FROM sessions S
               INNER JOIN films F ON S.filmId = F.id;
      `,
    );

    return response;
  }

  async update(id: number, dto: UpdateSessionDto) {
    const { params, keys } = Utils.MakeSetValue(dto);
    const session = (
      await this.database.query(
        `UPDATE %t
        SET ${keys}
          WHERE id=$1`,
        [id].concat(params),
        SessionEntity,
      )
    )[0];
    // TODO
    if (!session) throw new HttpException("Такой сессии не существует", HttpStatus.NOT_FOUND);

    return session;
  }

  async remove(id: number) {
    const session = await this.getOne(id);
    if (!session) throw new HttpException("Такой сессии не существует", HttpStatus.NOT_FOUND);
    const response = await this.database.query(
      `DELETE
       FROM %t
       WHERE id=$1`,
      [id],
    );

    return response;
  }

  async generateDTO(count: number, filmIds: number[], cinemaIds: number[], typeIds: number[]) {
    const dtos: CreateSessionDto[] = [];
    while (dtos.length < count) {
      const ticketsSold = Utils.GetRandomFromRange(5, 10000);
      const dto = new CreateSessionDto({
        date: fakerRU.date.future({ years: 1 }),
        ticketsSold,
        ticketsOnline: fakerRU.number.int({ max: ticketsSold }),
        price: Utils.GetRandomFromRange(100, 800),
        filmId: Utils.GetRandomFromArray(filmIds),
        cinemaId: Utils.GetRandomFromArray(cinemaIds),
        typeId: Utils.GetRandomFromArray(typeIds),
      });
      console.log(dto);

      dtos.push(dto);
    }

    return dtos;
  }

  async generate(count: number) {
    const filmIds = (await this.filmsService.getAll()).map((obj) => obj.id);
    const cinemaIds = (await this.cinemasService.getAll()).map((obj) => obj.id);
    const typeIds = (await this.typesService.getAll()).map((obj) => obj.id);
    if (filmIds.length < 1 || cinemaIds.length < 1 || typeIds.length < 1)
      throw new HttpException("Недостаточно данных для генерации", HttpStatus.BAD_REQUEST);
    const promises = (await this.generateDTO(count, filmIds, cinemaIds, typeIds)).map((dto) =>
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
