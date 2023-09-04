import { DatabaseError, Pool } from "pg";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Repository {
  private _pool: Pool = null;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.createPool();
  }

  private _tableName: string;

  set tableName(value: string) {
    value = value.trim();
    this._tableName = value;
  }

  connect() {
    return this._pool.connect();
  }

  createPool() {
    this._pool = new Pool({
      user: this.config.get("DB_USER_NAME"),
      password: this.config.get("DB_USER_PASSWORD"),
      host: this.config.get("DB_HOST"),
      database: this.config.get("DB_NAME"),
      port: this.config.get("DB_PORT"),
    });
  }

  async query<T extends object>(
    q: string,
    params: any[] = [],
    ctor: new (obj: object) => T = null,
    returning = true,
  ): Promise<T[]> {
    if (!this._tableName) throw new Error("Ошибка БД: не указана таблица для работы");
    q = this.parseQueryString(q, returning);

    Logger.debug(q);

    try {
      const result = await this._pool.query(q, params);
      const rows = result.rows;
      if (ctor) return rows.map((row) => new ctor(row));
      else return rows;
    } catch (error) {
      new DBError(error).throwError();
    }
  }

  private parseQueryString(q: string, returning: boolean): string {
    q = q.trim();
    const command = q.split(" ")[0];
    return (
      q.replace("%t", this._tableName) + (returning && command !== "SELECT" ? ` RETURNING *` : ``)
    );
  }
}

class DBError {
  private readonly _error: DatabaseError;

  constructor(error: DatabaseError) {
    this._error = error;
  }

  throwError() {
    console.table(this._error);
    switch (this._error.code) {
      case "23505":
        throw new Error(this.uniqueKeysError());
      case "23503":
        throw new Error(this.undefinedKeysError());
      default:
        throw new Error("Ошибка БД: " + this._error.message);
    }
  }

  private parseKeys() {
    const result = {};
    const regex = /\(([^=]+)\)=\(([^)]+)\)/g;
    let match;

    while ((match = regex.exec(this._error.detail)) !== null) {
      const key = match[1];
      result[key] = match[2];
    }

    return result;
  }

  private uniqueKeysError(): string {
    const keys = Object.keys(this.parseKeys());
    return `Значения для ${keys.map((k) => k)} таблицы ${
      this._error.table
    } должны быть уникальными`;
  }

  private undefinedKeysError(): string {
    const keys = Object.entries(this.parseKeys());
    return `Не верно указан внешний ключ: ${keys.map(
      (k) => `${k[0]}=${k[1]}`,
    )} при взаимодействии с таблицей ${this._error.table}`;
  }
}
