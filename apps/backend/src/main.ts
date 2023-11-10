import { Logger } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { AppModule } from "./app/app.module";
import { PG_CONNECTION } from "./database/database.module";
import { from } from "rxjs";
import * as process from "process";
import { AllFilter } from "./filters/all.filter";
import { Repository } from "./repositories/repository";
import { ValidationPipe } from "./pipes/validation.pipe";
import { useContainer } from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const port = process.env.BACKEND_PORT || 3000;

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllFilter(httpAdapter));
  const PG = await app.resolve<Repository>(PG_CONNECTION);
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
