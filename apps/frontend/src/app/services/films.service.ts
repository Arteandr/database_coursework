import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class FilmsService {
  constructor(private readonly httpClient: HttpClient) {}

  getAll() {
    return this.httpClient.get("/api/films");
  }

  getOne(id: number) {
    return this.httpClient.get(`/api/films/${id}`);
  }

  remove(id: number) {
    return this.httpClient.delete(`/api/films/${id}`);
  }
}
