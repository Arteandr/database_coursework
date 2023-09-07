import { Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { CinemaModule } from "../cinema/cinema.module";
import { FilmsModule } from "../films/films.module";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [CinemaModule, FilmsModule, SessionsModule],
  providers: [AppService],
})
export class AppModule {}
