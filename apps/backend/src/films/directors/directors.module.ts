import { Module } from "@nestjs/common";
import { DirectorsService } from "./directors.service";
import { DirectorsController } from "./directors.controller";
import { DatabaseModule } from "../../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [DirectorsController],
  providers: [DirectorsService],
})
export class DirectorsModule {}
