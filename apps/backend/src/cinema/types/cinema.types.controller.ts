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
import { NameDto } from "../../shared/dto/name.dto";
import { CustomResponse } from "../../shared/response";
import { CinemaTypesService } from "./cinema.types.service";

@Controller("/cinemaTypes")
export class CinemaTypesController {
  static NotFound = new HttpException("Такого типа кинотеатра не существует", HttpStatus.NOT_FOUND);

  constructor(
    @Inject(CinemaTypesService) private readonly cinemaTypesService: CinemaTypesService,
  ) {}

  @Post("")
  async createCinemaType(@Body() dto: NameDto) {
    const cinemaType = await this.cinemaTypesService.create(dto);

    return new CustomResponse(cinemaType, HttpStatus.CREATED);
  }

  @Get("")
  async getCinemaTypes() {
    const cinemaTypes = await this.cinemaTypesService.getAll();

    return new CustomResponse(cinemaTypes);
  }

  @Get("/:id")
  async getCinemaType(@Param("id", new ParseIntPipe()) id: number) {
    const cinemaType = await this.cinemaTypesService.getOne(id);
    if (!cinemaType) throw CinemaTypesController.NotFound;

    return new CustomResponse(cinemaType);
  }

  @Delete("/:id")
  async removeCinemaType(@Param("id", new ParseIntPipe()) id: number) {
    const cinemaType = await this.cinemaTypesService.remove(id);
    if (!cinemaType) throw CinemaTypesController.NotFound;

    return CustomResponse.Success();
  }

  @Put("/:id")
  async updateCinemaType(@Param("id", new ParseIntPipe()) id: number, @Body() dto: NameDto) {
    const cinemaType = await this.cinemaTypesService.update(id, dto);
    if (!cinemaType) throw CinemaTypesController.NotFound;

    return new CustomResponse(cinemaType);
  }
}
