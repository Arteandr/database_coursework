import { Component, OnInit } from "@angular/core";
import { TableService } from "./services/table.service";
import { Title } from "@angular/platform-browser";

interface data {
  name: string;
  age: number;
}

@Component({
  selector: "bd-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  readonly title = "БД";

  constructor(private readonly tableService: TableService, private readonly titleService: Title) {
    this.titleService.setTitle(this.title);
  }

  get selected$() {
    return this.tableService.selected$;
  }

  onCurrentTableChange(value: string) {
    this.tableService.changeSelected(value);
  }

  ngOnInit() {
    console.log();
  }
}
