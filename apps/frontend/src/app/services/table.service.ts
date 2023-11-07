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
    ];
  }

  public changeSelected(value: string) {
    this._selected$.next(value);
  }
}
