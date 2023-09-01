export class DBService {
  protected tableName: string;

  constructor(name: string) {
    this.tableName = name;
  }
}
