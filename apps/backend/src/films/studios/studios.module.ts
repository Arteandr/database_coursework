import { Module } from "@nestjs/common";
import { StudiosService } from "./studios.service";
import { StudiosController } from "./studios.controller";
import { DatabaseModule } from "../../database/database.module";
import { CountriesModule } from "../countries/countries.module";

@Module({
  imports: [CountriesModule, DatabaseModule],
  controllers: [StudiosController],
  providers: [StudiosService],
  exports: [StudiosService],
})
export class StudiosModule {}
