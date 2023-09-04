import { Body, Controller, HttpStatus, Inject, Post } from "@nestjs/common";
import { CinemaService } from "./cinema.service";
import { CreateCinemaDto } from "./dto/create-cinema.input";
import { CustomResponse } from "../shared/response";

@Controller("/cinemas")
export class CinemaController {
  constructor(@Inject(CinemaService) private readonly cinemaService: CinemaService) {}

  @Post()
  async createCinema(@Body() dto: CreateCinemaDto) {
    const cinema = await this.cinemaService.create(dto);

    return new CustomResponse(cinema, HttpStatus.CREATED);
  }
}
