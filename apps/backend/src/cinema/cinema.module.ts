import { Module } from "@nestjs/common";
import { CinemaService } from "./cinema.service";
import { CinemaTypesController } from "./cinema.types.controller";
import { DatabaseModule } from "../database/database.module";
import { DistrictController } from "./district.controller";
import { DistrictService } from "./district.service";
import { CinemaTypesService } from "./cinema.types.service";
import { CinemaController } from "./cinema.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [CinemaController, CinemaTypesController, DistrictController],
  providers: [CinemaService, DistrictService, CinemaTypesService],
})
export class CinemaModule {}
