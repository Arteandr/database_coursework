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

  @Get("/generate/:count")
  async generate(@Param("count", new ParseIntPipe()) count: number) {
    const cinemas = await this.cinemaService.generate(count);

    return new CustomResponse(cinemas);
  }

  @Get("/finalRequestWithGroups/:count")
  async getFinalRequestWithGroups(@Param("count", new ParseIntPipe()) count: number) {
    const response = await this.cinemaService.finalRequestWithGroups(count);

    return new CustomResponse(response);
  }

  @Get("/generateAverageNumberOfViewersForEachCinema")
  async getGenerateAverageNumberOfViewersForEachCinema() {
    const response = await this.cinemaService.generateAverageNumberOfViewersForEachCinema();

    return new CustomResponse(response);
  }

  @Get("/getTopFilmsByCinema")
  async getTopFilmsByCinema() {
    const response = await this.cinemaService.getTopFilmsByCinema(5);

    return new CustomResponse(response);
  }

  @Get("/generateAverageNumberOfViewersForAllCinemasInEachDist")
  async getGenerateAverageNumberOfViewersForAllCinemasInEachDist() {
    const response =
      await this.cinemaService.generateAverageNumberOfViewersForAllCinemasInEachDist();

    return new CustomResponse(response);
  }

  @Get("/:id")
  async getCinema(@Param("id", new ParseIntPipe()) id: number) {
    const cinema = await this.cinemaService.getOne(id);
    if (!cinema) throw CinemaController.NotFound;

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
