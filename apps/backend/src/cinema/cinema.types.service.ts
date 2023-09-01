import { Inject, Injectable } from "@nestjs/common";
import { PG_CONNECTION } from "../database/database.module";
import { NameDto } from "../shared/dto/name.dto";
import { DBService } from "../shared/db.service";
import { Repository } from "../repositories/repository";

@Injectable()
export class CinemaTypesService extends DBService {
  constructor(@Inject(PG_CONNECTION) private readonly database: Repository) {
    super("cinema_types");
  }

  async create(dto: NameDto) {
    const response = await this.database.query(`INSERT INTO ${this.tableName} (name) VALUES ($1)`, [
      dto.name,
    ]);
  }
}
