export class CinemaEntity {
  id: number;
  name: string;
  address: string;
  phone: string;
  license: string;
  licenseEnd: string;
  seats: number;
  online: boolean;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class CinemaTypeEntity {
  id: number;
  name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class DistrictEntity {
  id: number;
  name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
