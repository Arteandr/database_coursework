import { Module, Provider } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Pool } from "pg";

export const PG_CONNECTION = "PG_CONNECTION";

const dbProvider: Provider = {
  provide: PG_CONNECTION,
  useFactory(config: ConfigService) {
    return new Pool({
      user: config.get("DB_USER_NAME"),
      password: config.get("DB_USER_PASSWORD"),
      host: config.get("DB_HOST"),
      database: config.get("DB_NAME"),
      port: config.get("DB_PORT"),
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
