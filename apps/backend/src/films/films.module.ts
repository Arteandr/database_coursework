import { Module } from "@nestjs/common";
import { CountriesModule } from "./countries/countries.module";

@Module({
  imports: [CountriesModule],
})
export class FilmsModule {}
