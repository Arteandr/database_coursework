import { Module } from "@nestjs/common";
import { StudiosService } from "./studios.service";
import { StudiosController } from "./studios.controller";
import { DatabaseModule } from "../../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [StudiosController],
  providers: [StudiosService],
})
export class StudiosModule {}
