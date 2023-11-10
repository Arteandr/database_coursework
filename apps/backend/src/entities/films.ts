export class FilmEntity {
  id: number;
  name: string;
  description: string;
  photo: string;
  creationYear: number;
  duration: number;
  directorId: number;
  qualityId: number;
  studioId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class CountryEntity {
  id: number;
  name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class StudioEntity {
  id: number;
  name: string;
  creationYear: Date;
  countryId: number;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class QualityEntity {
  id: number;
  name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class DirectorEntity {
  id: number;
  firstName: string;
  lastName: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
