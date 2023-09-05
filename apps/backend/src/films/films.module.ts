import { Module } from "@nestjs/common";
import { CountriesModule } from "./countries/countries.module";
import { StudiosModule } from "./studios/studios.module";
import { QualitiesModule } from './qualities/qualities.module';
import { DirectorsModule } from './directors/directors.module';

@Module({
  imports: [CountriesModule, StudiosModule, QualitiesModule, DirectorsModule],
})
export class FilmsModule {}
