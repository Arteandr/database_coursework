import { Module } from "@nestjs/common";
import { QualitiesService } from "./qualities.service";
import { QualitiesController } from "./qualities.controller";
import { DatabaseModule } from "../../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [QualitiesController],
  providers: [QualitiesService],
})
export class QualitiesModule {}
