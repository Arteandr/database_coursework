import { IsString } from "class-validator";

export class NameDto {
  @IsString({ message: "Имя должно быть строкой" })
  name: string;
}
