import { Inject, Injectable } from "@nestjs/common";
import { UpdateCinemaInput } from "./dto/update-cinema.input";
import { PG_CONNECTION } from "../database/database.module";
import { from } from "rxjs";
import { NameDto } from "../shared/dto/name.dto";
import { Repository } from "../repositories/repository";

@Injectable()
export class CinemaService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {}

  create(dto: NameDto) {
    return from(this.database.query("SELECT * FROM cinemas;"));
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
