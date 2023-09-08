import { IsNumber, IsString } from "class-validator";

export class CreateFilmDto {
  @IsString({ message: "Имя фильма должно быть строкой" })
  name: string;

  @IsString({ message: "Описание фильма должно быть строкой" })
  description: string;

  @IsString({ message: "Ссылка на фото фильма должна быть строкой" })
  photo: string;

  @IsNumber({}, { message: "Год создания фильма должен быть числом" })
  creationYear: number;

  @IsNumber({}, { message: "Длительность фильма должен быть числом" })
  duration: number;

  @IsNumber({}, { message: "Режиссер указан неверно" })
  directorId: number;

  @IsNumber({}, { message: "Качество пленки указано неверно" })
  qualityId: number;

  @IsNumber({}, { message: "Студия указана неверно" })
  studioId: number;

  constructor(obj: object) {
    Object.assign(this, obj);
  }
}
