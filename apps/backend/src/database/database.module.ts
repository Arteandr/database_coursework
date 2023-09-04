import { Module, Provider, Scope } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Repository } from "../repositories/repository";

export const PG_CONNECTION = "PG_CONNECTION";

const dbProvider: Provider = {
  provide: PG_CONNECTION,
  scope: Scope.TRANSIENT,
  useFactory(config: ConfigService) {
    return new Repository(config);
  },
  inject: [ConfigService],
};

@Module({
  imports: [ConfigModule],
  providers: [dbProvider],
  exports: [dbProvider],
})
export class DatabaseModule {}
