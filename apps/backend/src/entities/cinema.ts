export class CinemaType {
  private id: number;
  private name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
