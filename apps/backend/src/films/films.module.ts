import { Module } from "@nestjs/common";
import { CountriesModule } from "./countries/countries.module";
import { StudiosModule } from "./studios/studios.module";

@Module({
  imports: [CountriesModule, StudiosModule],
})
export class FilmsModule {}
