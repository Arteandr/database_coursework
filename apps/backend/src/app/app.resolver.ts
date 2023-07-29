import { Query, Resolver } from "@nestjs/graphql";

@Resolver("app")
export class AppResolver {
  @Query("test")
  async getTest() {
    return `Hello, world!`;
  }
}
