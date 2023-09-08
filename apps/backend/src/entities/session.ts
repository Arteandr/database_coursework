export class SessionEntity {
  id: number;
  date: Date;
  ticketsSold: number;
  ticketsOnline: number;
  price: number;
  filmId: number;
  cinemaId: number;
  typeId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class SessionTypeEntity {
  id: number;
  name: string;
  ration: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
