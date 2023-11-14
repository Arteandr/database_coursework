import { IsNumber, IsString, Max } from "class-validator";

export class UpdateStudioDto {
  @IsString({ message: "Имя должно быть строкой" })
  name: string;

  @IsNumber({}, { message: "Год создания студии должен быть числом" })
  @Max(new Date().getFullYear(), { message: `Год создания студии не может быть больше текущего` })
  creationYear: number;

  @IsNumber({}, { message: "Неверно задана страна" })
  countryId: number;

  constructor(obj: object) {
    console.log("studios obj", obj);
    Object.assign(this, obj);
  }
}

export class SymmetricDateFirstDto {
  @IsString({ message: "Должно быть датой" })
  firstDate: Date;

  @IsString({ message: "Должно быть датой" })
  secondDate: Date;
}
