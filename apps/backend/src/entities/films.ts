export class CountryEntity {
  private id: number;
  private name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
