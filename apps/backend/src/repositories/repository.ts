import { DatabaseError, Pool } from "pg";
import { Inject, Injectable } from "@nestjs/common";
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

  async query(q: string, params: any[] = []) {
    q = this.parseQueryString(q);
    try {
      const response = await this._pool.query(q, params);
    } catch (error) {
      new DBError(error).throwError();
    }
  }

  private parseQueryString(q: string): string {
    return q.trim().replace("%t", this._tableName);
  }
}

class DBError {
  private readonly _error: DatabaseError;

  constructor(error: DatabaseError) {
    this._error = error;
  }

  throwError() {
    switch (this._error.code) {
      case "23505":
        throw new Error(this.keysError());
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

  private keysError(): string {
    const keys = Object.keys(this.parseKeys());
    return `Значения для ${keys.map((k) => k)} таблицы ${
      this._error.table
    } должны быть уникальными`;
  }
}
