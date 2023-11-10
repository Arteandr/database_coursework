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
import { FilmsService } from "./films.service";
import { CreateFilmDto } from "./dto/create-film.dto";
import { CustomResponse } from "../shared/response";
import { UpdateFilmDto } from "./dto/update-film.dto";

@Controller("/films")
export class FilmsController {
  static NotFound = new HttpException("Такого фильма не существует", HttpStatus.NOT_FOUND);

  constructor(@Inject(FilmsService) private readonly filmsService: FilmsService) {}

  @Post()
  async create(@Body() dto: CreateFilmDto) {
    const films = await this.filmsService.create(dto);

    return new CustomResponse(films, HttpStatus.CREATED);
  }

  @Get()
  async getAll() {
    const films = await this.filmsService.getAll();

    return new CustomResponse(films);
  }

  @Get("/requestWithFinalData/:id")
  async getRequestWithFinalData(@Param("id") id: number) {
    const response = await this.filmsService.requestWithFinalData(id);

    return new CustomResponse(response);
  }

  @Get("/withDirector/:id")
  async getOneWithDirector(@Param("id", new ParseIntPipe()) id: number) {
    const film = await this.filmsService.getWithDirector(id);
    if (!film) throw FilmsController.NotFound;

    return new CustomResponse(film);
  }

  @Get("/symmetricForeignFirst/:id")
  async getSymForeignFirst(@Param("id", new ParseIntPipe()) id: number) {
    const response = await this.filmsService.symetricJoinWithAConditionByAForeignKey(id);

    return new CustomResponse(response);
  }

  @Get("/symmetricForeignSecond/:id")
  async getSymForeignSecond(@Param("id", new ParseIntPipe()) id: number) {
    const response = await this.filmsService.symmetricWithACondByAForeignKeySecond(id);

    return new CustomResponse(response);
  }

  @Get("/finalBySpecificMask/:id")
  async getFinalBySpecificMask(@Param() params) {
    const response = await this.filmsService.finalBySpecificMask(params["id"]);

    return new CustomResponse(response);
  }

  @Get("/finalByIndex")
  async getFinalByIndex() {
    const response = await this.filmsService.finalByIndex();

    return new CustomResponse(response);
  }

  @Get("/finalWithoutIndex")
  async getFinalWithoutIndex() {
    const response = await this.filmsService.finalWithoutIndex();

    return new CustomResponse(response);
  }

  @Get("/finalBySpecificValue/:id")
  async getFinalBySpecificValue(@Param() params) {
    if (!params["id"]) return;
    const response = await this.filmsService.finalBySpecificValue(params["id"]);

    return new CustomResponse(response);
  }

  @Get("/requestOnRequestLeft")
  async getRequestOnRequestLeft() {
    const response = await this.filmsService.requestOnRequest();

    return new CustomResponse(response);
  }

  @Get("/getAllCount")
  async getAllCount() {
    const response = await this.filmsService.getAllCount();
    return new CustomResponse(response);
  }

  @Get("/requestWithCase")
  async getRequestWithCase() {
    const response = await this.filmsService.requestWithCase();

    return new CustomResponse(response);
  }

  @Get("/requestWithIn")
  async getRequestWithIn() {
    const response = await this.filmsService.requestWithIn();

    return new CustomResponse(response);
  }

  @Get("/finalRequestWithInclude")
  async getFinalRequestWithInclude() {
    const response = await this.filmsService.finalRequestWithInclude();

    return new CustomResponse(response);
  }

  @Get("/symmetricWithoutCondFirst")
  async getSymWithoutFirst() {
    const response = await this.filmsService.symmetricJoinWithoutConditionFirst();

    return new CustomResponse(response);
  }

  @Get("/generate/:count")
  async generate(@Param("count", new ParseIntPipe()) count: number) {
    const films = await this.filmsService.generate(count);

    return new CustomResponse(films);
  }

  @Get(":id")
  async getOne(@Param("id", new ParseIntPipe()) id: number) {
    const film = await this.filmsService.getOne(id);
    if (!film) throw FilmsController.NotFound;

    return new CustomResponse(film);
  }

  @Put(":id")
  async update(@Param("id", new ParseIntPipe()) id: number, @Body() dto: UpdateFilmDto) {
    const film = await this.filmsService.update(id, dto);

    return new CustomResponse(film);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseIntPipe()) id: number) {
    const films = await this.filmsService.remove(id);
    if (!films) throw FilmsController.NotFound;

    return CustomResponse.Success();
  }
}
