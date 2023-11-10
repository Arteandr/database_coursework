import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";
import { StudiosService } from "./studios.service";
import { CreateStudioDto } from "./dto/create-studio.dto";
import { UpdateStudioDto } from "./dto/update-studio.dto";
import { CustomResponse } from "../../shared/response";

@Controller("/studios")
export class StudiosController {
  constructor(private readonly studiosService: StudiosService) {}

  @Post()
  async create(@Body() createStudioDto: CreateStudioDto) {
    const response = this.studiosService.create(createStudioDto);

    return new CustomResponse(response, HttpStatus.CREATED);
  }

  @Get()
  async findAll() {
    const response = await this.studiosService.getAll();

    return new CustomResponse(response);
  }

  @Get("/symmetricDateFirst/:date")
  async getSymDateFirst(@Param() params) {
    const date = params["date"].split(" ");
    const response = await this.studiosService.symmetricJoinWithAConditionByADate(
      new Date(date[0]),
      new Date(`${Number(date[1]) + 1}`),
    );
    console.log("RESPONSE: ", response);

    return new CustomResponse(response);
  }

  @Get("/rightOuter")
  async getRightOuter() {
    const response = await this.studiosService.rightOuterJoin();

    return new CustomResponse(response);
  }

  @Get("/symmetricWithoutCondThird")
  async getSymWithoutThird() {
    const response = await this.studiosService.symmetricJoinWithoutConditionThird();

    return new CustomResponse(response);
  }

  @Get("/generate/:count")
  async generate(@Param("count", new ParseIntPipe()) count: number) {
    const films = await this.studiosService.generate(count);

    return new CustomResponse(films);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const response = await this.studiosService.getOne(+id);

    return new CustomResponse(response);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateStudioDto: UpdateStudioDto) {
    return this.studiosService.update(+id, updateStudioDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studiosService.remove(+id);
  }
}
