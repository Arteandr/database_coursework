import { PartialType } from "@nestjs/mapped-types";
import { CreateStudioDto } from "./create-studio.dto";
import { IsString } from "class-validator";

export class UpdateStudioDto extends PartialType(CreateStudioDto) {}

export class SymmetricDateFirstDto {
  @IsString({ message: "Должно быть датой" })
  firstDate: Date;

  @IsString({ message: "Должно быть датой" })
  secondDate: Date;
}
