import { CreateCinemaInput } from './create-cinema.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCinemaInput extends PartialType(CreateCinemaInput) {
  id: number;
}
