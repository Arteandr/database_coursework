import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { CustomResponse } from "../shared/response";

@Catch()
export class AllFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    console.log("filter executed");
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.response
      ? exception.response
      : exception.message
      ? exception.message
      : "Внутреняя ошибка сервера";

    console.log("before reply");
    console.log("message: ", message, " httpStatus: ", httpStatus);
    httpAdapter.reply(
      ctx.getResponse(),
      new CustomResponse(
        {
          error: message,
        },
        httpStatus,
      ),
      httpStatus,
    );
  }
}
