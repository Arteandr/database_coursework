import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { TypesModule } from "./types/types.module";
import { DatabaseModule } from "../database/database.module";
import { FilmsModule } from "../films/films.module";
import { CinemaModule } from "../cinema/cinema.module";

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [DatabaseModule, FilmsModule, CinemaModule, TypesModule],
})
export class SessionsModule {}
