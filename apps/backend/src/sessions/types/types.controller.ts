import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { SessionTypesService } from "./types.service";
import { CreateSessionTypeDto } from "./dto/create-session-type.dto";
import { UpdateSessionTypeDto } from "./dto/update-session-type.dto";
import { CustomResponse } from "../../shared/response";

@Controller("/sessionTypes")
export class SessionTypesController {
  static NotFound = new HttpException("Такого типа сессии не существует", HttpStatus.NOT_FOUND);

  constructor(
    @Inject(SessionTypesService) private readonly sessionTypesService: SessionTypesService,
  ) {}

  @Post()
  async create(@Body() dto: CreateSessionTypeDto) {
    const sessionType = await this.sessionTypesService.create(dto);

    return new CustomResponse(sessionType, HttpStatus.CREATED);
  }

  @Get(":id")
  async getOne(@Param("id", new ParseIntPipe()) id: number) {
    const sessionType = await this.sessionTypesService.getOne(id);
    if (!sessionType) throw SessionTypesController.NotFound;

    return new CustomResponse(sessionType);
  }

  @Get()
  async getAll() {
    const sessionTypes = await this.sessionTypesService.getAll();

    return new CustomResponse(sessionTypes);
  }

  @Put(":id")
  async update(@Param("id", new ParseIntPipe()) id: number, @Body() dto: UpdateSessionTypeDto) {
    const sessionType = await this.sessionTypesService.update(id, dto);

    return new CustomResponse(sessionType);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseIntPipe()) id: number) {
    const sessionType = await this.sessionTypesService.remove(id);
    if (!sessionType) throw SessionTypesController.NotFound;

    return CustomResponse.Success();
  }
}
