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
import { CountriesService } from "./countries.service";
import { NameDto } from "../../shared/dto/name.dto";
import { CustomResponse } from "../../shared/response";

@Controller("/countries")
export class CountriesController {
  static NotFound = new HttpException("Такой страны не существует", HttpStatus.NOT_FOUND);

  constructor(@Inject(CountriesService) private readonly countriesService: CountriesService) {}

  @Post()
  async createCountry(@Body() dto: NameDto) {
    const country = await this.countriesService.create(dto);

    return new CustomResponse(country, HttpStatus.CREATED);
  }

  @Get()
  async getAll() {
    const countries = await this.countriesService.getAll();

    return new CustomResponse(countries);
  }

  @Get(":id")
  async getOne(@Param("id", new ParseIntPipe()) id: number) {
    const country = await this.countriesService.getOne(id);
    if (!country) throw CountriesController.NotFound;

    return new CustomResponse(country);
  }

  @Put(":id")
  async update(@Param("id", new ParseIntPipe()) id: number, @Body() dto: NameDto) {
    const country = await this.countriesService.update(id, dto);

    return new CustomResponse(country);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseIntPipe()) id: number) {
    const country = await this.countriesService.remove(+id);
    if (!country) throw CountriesController.NotFound;

    return CustomResponse.Success();
  }
}
