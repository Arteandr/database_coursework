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
import { DistrictService } from "./district.service";

@Controller("/districts")
export class DistrictController {
  static NotFound = new HttpException("Такого района не существует", HttpStatus.NOT_FOUND);

  constructor(@Inject(DistrictService) private readonly districtService: DistrictService) {}

  @Post("")
  async createDistrict(@Body() dto: NameDto) {
    const district = await this.districtService.create(dto);

    return new CustomResponse(district, HttpStatus.CREATED);
  }

  @Get("")
  async getDistricts() {
    const district = await this.districtService.getAll();

    return new CustomResponse(district);
  }

  @Get("/getTopFilmsByDistrict")
  async getTopFilmsByDistrict() {
    const response = await this.districtService.getTopFilmsByDistrict(5);

    return new CustomResponse(response);
  }

  @Get("/requestWithUnion")
  async getRequestWithUnion() {
    const response = await this.districtService.requestWithUnion();

    return new CustomResponse(response);
  }

  @Get("/requestWithNotIn")
  async getRequestWithNotIn() {
    const response = await this.districtService.requestWithNotIn();

    return new CustomResponse(response);
  }

  @Get("/:id")
  async getDistrict(@Param("id", new ParseIntPipe()) id: number) {
    const district = await this.districtService.getOne(id);
    if (!district) throw DistrictController.NotFound;

    return new CustomResponse(district);
  }

  @Delete("/:id")
  async removeDistrict(@Param("id", new ParseIntPipe()) id: number) {
    const district = await this.districtService.remove(id);
    if (!district) throw DistrictController.NotFound;

    return CustomResponse.Success();
  }

  @Put("/:id")
  async updateCinemaType(@Param("id", new ParseIntPipe()) id: number, @Body() dto: NameDto) {
    const district = await this.districtService.update(id, dto);

    return new CustomResponse(district);
  }
}
