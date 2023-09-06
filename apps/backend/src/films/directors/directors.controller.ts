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
import { DirectorsService } from "./directors.service";
import { CreateDirectorDto } from "./dto/create-director.dto";
import { UpdateDirectorDto } from "./dto/update-director.dto";
import { CustomResponse } from "../../shared/response";

@Controller("/films/directors")
export class DirectorsController {
  static NotFound = new HttpException("Такого режиссера не существует", HttpStatus.NOT_FOUND);

  constructor(@Inject(DirectorsService) private readonly directorsService: DirectorsService) {}

  @Post()
  async create(@Body() createDirectorDto: CreateDirectorDto) {
    const director = await this.directorsService.create(createDirectorDto);

    return new CustomResponse(director, HttpStatus.CREATED);
  }

  @Get()
  async getAll() {
    const directors = await this.directorsService.getAll();

    return new CustomResponse(directors);
  }

  @Get(":id")
  async getOne(@Param("id", new ParseIntPipe()) id: number) {
    const director = await this.directorsService.getOne(id);
    if (!director) throw DirectorsController.NotFound;

    return new CustomResponse(director);
  }

  @Put(":id")
  async update(
    @Param("id", new ParseIntPipe()) id: number,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ) {
    const director = await this.directorsService.update(id, updateDirectorDto);

    return new CustomResponse(director);
  }

  @Delete(":id")
  async remove(@Param("id", new ParseIntPipe()) id: number) {
    const director = await this.directorsService.remove(id);
    if (!director) throw DirectorsController.NotFound;

    return CustomResponse.Success();
  }
}
