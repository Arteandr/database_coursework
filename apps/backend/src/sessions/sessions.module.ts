import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { TypesModule } from "./types/types.module";
import { DatabaseModule } from "../database/database.module";

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [DatabaseModule, TypesModule],
})
export class SessionsModule {}
