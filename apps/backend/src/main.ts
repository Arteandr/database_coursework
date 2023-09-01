import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { PG_CONNECTION } from "./database/database.module";
import { Pool } from "pg";
import { from } from "rxjs";
import * as process from "process";
import { AllFilter } from "./filters/all.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.BACKEND_PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllFilter(httpAdapter));
  const PG = await app.get<Pool>(PG_CONNECTION);
  from(PG.connect()).subscribe({
    next: () => {
      Logger.log("Успешное подключение к БД");
    },
    error: (err) => {
      Logger.error("Невозможно подключиться к БД", err);
      return process.exit(1);
    },
  });
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
