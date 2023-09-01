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
import { NameDto } from "../shared/dto/name.dto";
import { CinemaService } from "./cinema.service";
import { CinemaTypesService } from "./cinema.types.service";
import { CustomResponse } from "../shared/response";

@Controller("/cinemas")
export class CinemaController {
  static NotFound = new HttpException("Такого типа кинотеатра не существует", HttpStatus.NOT_FOUND);

  constructor(
    @Inject(CinemaTypesService) private readonly cinemaTypesService: CinemaTypesService,
    @Inject(CinemaService) private readonly cinemasService: CinemaService,
  ) {}

  @Post("/types")
  async createCinemaType(@Body() dto: NameDto) {
    const cinemaType = await this.cinemaTypesService.create(dto);

    return new CustomResponse(cinemaType, HttpStatus.CREATED);
  }

  @Get("/types")
  async getCinemaTypes() {
    const cinemaTypes = await this.cinemaTypesService.getAll();

    return new CustomResponse(cinemaTypes);
  }

  @Get("/types/:id")
  async getCinemaType(@Param("id", new ParseIntPipe()) id: number) {
    const cinemaType = await this.cinemaTypesService.getOne(id);
    if (!cinemaType) throw CinemaController.NotFound;

    return new CustomResponse(cinemaType);
  }

  @Delete("/types/:id")
  async removeCinemaType(@Param("id", new ParseIntPipe()) id: number) {
    const cinemaType = await this.cinemaTypesService.remove(id);
    if (!cinemaType) throw CinemaController.NotFound;

    return CustomResponse.Success();
  }

  @Put("/types/:id")
  async updateCinemaType(@Param("id", new ParseIntPipe()) id: number, @Body() dto: NameDto) {
    const cinemaType = await this.cinemaTypesService.update(id, dto);

    return new CustomResponse(cinemaType);
  }
}
