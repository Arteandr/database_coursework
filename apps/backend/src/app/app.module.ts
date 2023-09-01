import { Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { CinemaModule } from "../cinema/cinema.module";

@Module({
  imports: [CinemaModule],
  providers: [AppService],
})
export class AppModule {}
