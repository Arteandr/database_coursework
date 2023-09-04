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
import { CinemaService } from "./cinema.service";
import { CreateCinemaDto } from "./dto/create-cinema.input";
import { CustomResponse } from "../shared/response";
import { UpdateCinemaDto } from "./dto/update-cinema.input";

@Controller("/cinemas")
export class CinemaController {
  static NotFound = new HttpException("Такого кинотеатра не существует", HttpStatus.NOT_FOUND);

  constructor(@Inject(CinemaService) private readonly cinemaService: CinemaService) {}

  @Post()
  async createCinema(@Body() dto: CreateCinemaDto) {
    const cinema = await this.cinemaService.create(dto);

    return new CustomResponse(cinema, HttpStatus.CREATED);
  }

  @Get()
  async getCinemas() {
    const cinemas = await this.cinemaService.getAll();

    return new CustomResponse(cinemas);
  }

  @Get("/:id")
  async getCinema(@Param("id", new ParseIntPipe()) id: number) {
    const cinema = await this.cinemaService.getOne(id);

    return new CustomResponse(cinema);
  }

  @Put("/:id")
  async updateCinema(@Param("id", new ParseIntPipe()) id: number, @Body() dto: UpdateCinemaDto) {
    const cinema = await this.cinemaService.update(id, dto);

    return new CustomResponse(cinema);
  }

  @Delete("/:id")
  async removeCinema(@Param("id", new ParseIntPipe()) id: number) {
    const cinema = await this.cinemaService.remove(id);
    if (!cinema) throw CinemaController.NotFound;

    return CustomResponse.Success();
  }
}
