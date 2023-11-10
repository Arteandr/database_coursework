import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { CustomResponse } from "../shared/response";

@Controller("/sessions")
export class SessionsController {
  static NotFound = new HttpException("Такого сеанса не существует", HttpStatus.NOT_FOUND);

  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async create(@Body() dto: CreateSessionDto) {
    const session = await this.sessionsService.create(dto);

    return new CustomResponse(session, HttpStatus.CREATED);
  }

  @Get()
  async getAll() {
    const sessions = await this.sessionsService.getAll();

    return new CustomResponse(sessions);
  }

  @Get("/generate/:count")
  async generate(@Param("count", new ParseIntPipe()) count: number) {
    const sessions = await this.sessionsService.generate(count);

    return new CustomResponse(sessions);
  }

  @Get("/symmetricWithoutCondSecond")
  async getSymWithoutSecond() {
    const response = await this.sessionsService.symmetricJoinWithoutConditionSecond();

    return new CustomResponse(response);
  }

  @Get(":id")
  async getOne(@Param("id", new ParseIntPipe()) id: number) {
    const session = await this.sessionsService.getOne(id);
    if (!session) throw SessionsController.NotFound;

    return new CustomResponse(session);
  }

  @Put(":id")
  async update(@Param("id", new ParseIntPipe()) id: number, @Body() dto: UpdateSessionDto) {
    const session = await this.sessionsService.update(id, dto);

    return new CustomResponse(session);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseIntPipe()) id: number) {
    const session = await this.sessionsService.remove(id);
    if (!session) throw SessionsController.NotFound;

    return CustomResponse.Success();
  }
}
