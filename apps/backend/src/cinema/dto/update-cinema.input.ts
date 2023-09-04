import { CreateCinemaDto } from "./create-cinema.input";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCinemaDto extends PartialType(CreateCinemaDto) {}
