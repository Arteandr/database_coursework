import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { DistrictController } from "./district.controller";
import { DistrictService } from "./district.service";

@Module({
  imports: [DatabaseModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
