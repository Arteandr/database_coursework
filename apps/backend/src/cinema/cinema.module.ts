import { Module } from "@nestjs/common";
import { CinemaService } from "./cinema.service";
import { CinemaTypesController } from "./types/cinema.types.controller";
import { DatabaseModule } from "../database/database.module";
import { DistrictController } from "./districts/district.controller";
import { DistrictService } from "./districts/district.service";
import { CinemaTypesService } from "./types/cinema.types.service";
import { CinemaController } from "./cinema.controller";
import { DistrictModule } from "./districts/district.module";
import { CinemaTypesModule } from "./types/cinema.types.module";

@Module({
  imports: [DatabaseModule, DistrictModule, CinemaTypesModule],
  controllers: [CinemaController, CinemaTypesController, DistrictController],
  providers: [DistrictService, CinemaTypesService, CinemaService],
  exports: [CinemaService],
})
export class CinemaModule {}
