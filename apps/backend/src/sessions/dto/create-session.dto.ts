import { IsNumber, IsString } from "class-validator";

export class CreateSessionDto {
  @IsString({ message: "Дата сеанса указана неверно" })
  date: Date;

  @IsNumber({}, { message: "Количество проданных билетов должно быть числом" })
  ticketsSold: number;

  @IsNumber({}, { message: "Количество заказаных билетов через интернет должно быть числом" })
  ticketsOnline: number;

  @IsNumber({}, { message: "Цена билета на сеанс должна быть числом" })
  price: number;

  @IsNumber({}, { message: "Фильм указан не верно" })
  filmId: number;

  @IsNumber({}, { message: "Кинотеатр указан не верно" })
  cinemaId: number;

  @IsNumber({}, { message: "Тип сеанса указан не верно" })
  typeId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
