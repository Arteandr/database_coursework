import { IsNumber, IsString } from "class-validator";

export class CreateSessionTypeDto {
  @IsString({ message: "Имя типа сессии должно быть строкой" })
  name: string;

  @IsNumber({}, { message: "Коэффициент сессии должен быть числом" })
  ration: number;
}
