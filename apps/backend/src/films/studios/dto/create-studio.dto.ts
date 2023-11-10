import { IsNumber, IsString, Max } from "class-validator";

export class CreateStudioDto {
  @IsString({ message: "Имя должно быть строкой" })
  name: string;

  @IsNumber({}, { message: "Год создания студии должен быть числом" })
  @Max(new Date().getFullYear(), { message: `Год создания студии не может быть больше текущего` })
  creationYear: number;

  @IsNumber({}, { message: "Неверно задана страна" })
  countryId: number;

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
