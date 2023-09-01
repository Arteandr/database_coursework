import { Module } from "@nestjs/common";
import { CinemaService } from "./cinema.service";
import { CinemaController } from "./cinema.controller";
import { DatabaseModule } from "../database/database.module";
import { CinemaTypesService } from "./cinema.types.service";

@Module({
  imports: [DatabaseModule],
  controllers: [CinemaController],
  providers: [CinemaService, CinemaTypesService],
})
export class CinemaModule {}
