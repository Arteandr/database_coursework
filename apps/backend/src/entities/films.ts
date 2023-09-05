export class CountryEntity {
  private id: number;
  private name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class StudioEntity {
  private id: number;
  private name: string;
  private creationYear: Date;
  private countryId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class QualityEntity {
  private id: number;
  private name: string;
}
