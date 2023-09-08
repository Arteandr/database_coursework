import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { CinemaTypesController } from "./cinema.types.controller";
import { CinemaTypesService } from "./cinema.types.service";

@Module({
  imports: [DatabaseModule],
  controllers: [CinemaTypesController],
  providers: [CinemaTypesService],
  exports: [CinemaTypesService],
})
export class CinemaTypesModule {}
