export class SessionEntity {
  private id: number;
  private date: Date;
  private ticketsSold: number;
  private ticketsOnline: number;
  private price: number;
  private filmId: number;
  private cinemaId: number;
  private typeId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class SessionTypeEntity {
  private id: number;
  private name: string;
  private ration: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
