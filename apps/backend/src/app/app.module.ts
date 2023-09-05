import { Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { CinemaModule } from "../cinema/cinema.module";
import { FilmsModule } from "../films/films.module";

@Module({
  imports: [CinemaModule, FilmsModule],
  providers: [AppService],
})
export class AppModule {}
