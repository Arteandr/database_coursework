import { CreateCinemaDto } from "./create-cinema.input";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCinemaInput extends PartialType(CreateCinemaDto) {
  id: number;
}
