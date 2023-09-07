import { Module } from "@nestjs/common";
import { SessionTypesService } from "./types.service";
import { SessionTypesController } from "./types.controller";
import { DatabaseModule } from "../../database/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [SessionTypesController],
  providers: [SessionTypesService],
})
export class TypesModule {}
