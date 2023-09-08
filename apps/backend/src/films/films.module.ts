import { Module } from "@nestjs/common";
import { CountriesModule } from "./countries/countries.module";
import { StudiosModule } from "./studios/studios.module";
import { QualitiesModule } from "./qualities/qualities.module";
import { DirectorsModule } from "./directors/directors.module";
import { FilmsService } from "./films.service";
import { DatabaseModule } from "../database/database.module";
import { FilmsController } from "./films.controller";

@Module({
  imports: [
    DirectorsModule,
    DatabaseModule,
    CountriesModule,
    StudiosModule,
    QualitiesModule,
    DirectorsModule,
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
