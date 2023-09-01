import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { NameDto } from "../shared/dto/name.dto";
import { CinemaService } from "./cinema.service";
import { CinemaTypesService } from "./cinema.types.service";

@Controller("/cinemas")
export class CinemaController {
  constructor(
    @Inject(CinemaTypesService) private readonly cinemaTypesService: CinemaTypesService,
    @Inject(CinemaService) private readonly cinemasService: CinemaService,
  ) {}

  @Post("/types")
  async createCinemaType(@Body() dto: NameDto) {
    const cinema = await this.cinemaTypesService.create(dto);
  }

  @Get("/types")
  getCinemaTypes() {}
}
