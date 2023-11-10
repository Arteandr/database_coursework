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
import { QualitiesService } from "./qualities.service";
import { NameDto } from "../../shared/dto/name.dto";
import { CustomResponse } from "../../shared/response";

@Controller("/qualities")
export class QualitiesController {
  static NotFound = new HttpException("Такого качества не существует", HttpStatus.NOT_FOUND);

  constructor(@Inject(QualitiesService) private readonly qualitiesService: QualitiesService) {}

  @Post()
  async create(@Body() dto: NameDto) {
    const quality = await this.qualitiesService.create(dto);

    return new CustomResponse(quality, HttpStatus.CREATED);
  }

  @Get()
  async getAll() {
    const qualities = await this.qualitiesService.getAll();

    return new CustomResponse(qualities);
  }

  @Get("/finalRequestGroupsData/:count")
  async getFinalRequestGroupsData(@Param("count", new ParseIntPipe()) count: number) {
    const response = await this.qualitiesService.finalRequestGroupsData(count);

    return new CustomResponse(response);
  }

  @Get(":id")
  async getOne(@Param("id", new ParseIntPipe()) id: number) {
    const quality = await this.qualitiesService.getOne(+id);
    if (!quality) throw QualitiesController.NotFound;

    return new CustomResponse(quality);
  }

  @Put(":id")
  async update(@Param("id", new ParseIntPipe()) id: number, @Body() dto: NameDto) {
    const quality = await this.qualitiesService.update(id, dto);
    if (!quality) throw QualitiesController.NotFound;

    return new CustomResponse(quality);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseIntPipe()) id: number) {
    const response = await this.qualitiesService.remove(id);
    if (!response) throw QualitiesController.NotFound;

    return CustomResponse.Success();
  }
}
