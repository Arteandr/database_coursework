import { IsString } from "class-validator";

export class CreateDirectorDto {
  @IsString({ message: "Имя режиссера должно быть строкой" })
  firstName: string;

  @IsString({ message: "Фамилия режиссера должно быть строкой" })
  lastName: string;
}
