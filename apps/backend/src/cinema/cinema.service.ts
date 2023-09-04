import { Inject, Injectable } from "@nestjs/common";
import { UpdateCinemaInput } from "./dto/update-cinema.input";
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

  findAll() {
    return `This action returns all cinema`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cinema`;
  }

  update(id: number, updateCinemaInput: UpdateCinemaInput) {
    return `This action updates a #${id} cinema`;
  }

  remove(id: number) {
    return `This action removes a #${id} cinema`;
  }
}
