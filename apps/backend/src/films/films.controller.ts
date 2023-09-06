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
