export class CinemaEntity {
  private id: number;
  private name: string;
  private address: string;
  private phone: string;
  private license: string;
  private licenseEnd: string;
  private seats: number;
  private online: boolean;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class CinemaTypeEntity {
  private id: number;
  private name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}

export class DistrictEntity {
  private id: number;
  private name: string;

  constructor(object: object) {
    Object.assign(this, object);
  }
}
