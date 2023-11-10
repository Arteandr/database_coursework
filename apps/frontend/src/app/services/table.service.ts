import { Injectable } from "@angular/core";
import { BehaviorSubject, filter } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TableService {
  private _selected$ = new BehaviorSubject<string>("");

  get selected$() {
    return this._selected$.asObservable().pipe(filter((val) => val.trim().length > 0));
  }

  tables() {
    return [
      { name: "Фильмы", ref: "films" },
      { name: "Кинотеатры", ref: "cinemas" },
      { name: "Сеансы", ref: "sessions" },
      { name: "Режиссеры", ref: "directors" },
      { name: "Качество пленки", ref: "film_qualities" },
      { name: "Студии", ref: "studios" },
      { name: "Тип сеансов", ref: "session_types" },
      { name: "Тип собственности", ref: "cinema_types" },
      { name: "Районы", ref: "districts" },
      { name: "Страны (размещения студий)", ref: "countries" },
    ];
  }

  public changeSelected(value: string) {
    this._selected$.next(value);
  }
}
