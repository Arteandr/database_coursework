import { HttpStatus } from "@nestjs/common";

export class CustomResponse {
  constructor(private readonly data: object, private readonly status: HttpStatus = HttpStatus.OK) {}

  static Success() {
    return new CustomResponse({
      success: "success",
    });
  }
}
