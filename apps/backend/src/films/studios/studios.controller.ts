import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StudiosService } from "./studios.service";
import { CreateStudioDto } from "./dto/create-studio.dto";
import { SymmetricDateFirstDto, UpdateStudioDto } from "./dto/update-studio.dto";
import { CustomResponse } from "../../shared/response";

@Controller("/studios")
export class StudiosController {
  constructor(private readonly studiosService: StudiosService) {}

  @Post()
  create(@Body() createStudioDto: CreateStudioDto) {
    return this.studiosService.create(createStudioDto);
  }

  @Get()
  findAll() {
    return this.studiosService.getAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.studiosService.getOne(+id);
  }

  @Get("/symmetricDateFirst")
  async getSymDateFirst(@Body() dto: SymmetricDateFirstDto) {
    const response = await this.studiosService.symmetricJoinWithAConditionByADate(
      dto.firstDate,
      dto.secondDate,
    );

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

  @Put(":id")
  update(@Param("id") id: string, @Body() updateStudioDto: UpdateStudioDto) {
    return this.studiosService.update(+id, updateStudioDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.studiosService.remove(+id);
  }
}
