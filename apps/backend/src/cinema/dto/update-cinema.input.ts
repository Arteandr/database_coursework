import { IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateCinemaDto {
  @IsString({ message: "Имя должно быть строкой" })
  name: string;

  @IsString({ message: "Адресс должен быть строкой" })
  address: string;

  @IsString({ message: "Телефон должен быть строкой" })
  phone: string;

  @IsString({ message: "Лицензия должна быть строкой" })
  license: string;

  @IsString({ message: "Дата окончания лицензии не верная" })
  licenseEnd: Date;

  @IsNumber({}, { message: "Количество сидений должно быть числом" })
  seats: number;

  @IsBoolean({ message: "Возможность покупки указана не верно" })
  online: boolean;

  @IsNumber({}, { message: "Неверно задан тип кинотеатра" })
  typeId: number;

  @IsNumber({}, { message: "Неверно задан район" })
  districtId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
