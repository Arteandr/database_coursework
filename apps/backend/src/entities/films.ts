export class FilmEntity {
  private id: number;
  private name: string;
  private description: string;
  private photo: string;
  private creationYear: number;
  private duration: number;
  private directorId: number;
  private qualityId: number;
  private studioId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

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

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class DirectorEntity {
  private id: number;
  private firstName: string;
  private lastName: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
