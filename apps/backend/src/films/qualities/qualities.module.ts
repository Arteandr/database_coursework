import { Module } from '@nestjs/common';
import { QualitiesService } from './qualities.service';
import { QualitiesController } from './qualities.controller';

@Module({
  controllers: [QualitiesController],
  providers: [QualitiesService]
})
export class QualitiesModule {}
