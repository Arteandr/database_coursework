import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonUiModule } from "@bd/common-ui";
import { TableService } from "../services/table.service";
import { FilmsService } from "../services/films.service";
import { take } from "rxjs";

@Component({
  selector: "bd-main-table",
  template: ` <div class="main-table">
    <bd-table-picker
      (changeEvent)="onCurrentTableChange($event)"
      [options]="tables"
    ></bd-table-picker>
    <bd-source-table [currentTable$]="selected$"></bd-source-table>
  </div>`,
  styleUrls: ["./main-table.component.scss"],
  standalone: true,
  imports: [CommonUiModule],
})
export class MainTableComponent implements OnInit {
  tables: { name: string; ref: string }[] = [];

  constructor(
    private readonly tableService: TableService,
    private readonly filmsService: FilmsService,
  ) {}

  get selected$() {
    return this.tableService.selected$;
  }

  onCurrentTableChange(value: string) {
    this.tableService.changeSelected(value);
  }

  ngOnInit(): void {
    this.tables = this.tableService.tables();
    this.filmsService.getAll().pipe(take(2)).subscribe(console.log);
  }
}

@Component({
  selector: "bd-main-table-window",
  template: ` <bd-movable-window [zIndex]="zIndex" (windowClick)="onWindowClick($event)">
    <bd-main-table></bd-main-table>
  </bd-movable-window>`,
  standalone: true,
  imports: [CommonUiModule, MainTableComponent],
})
export class MainTableWindowComponent {
  @Output() windowClick = new EventEmitter<boolean>();
  @Input() zIndex = 0;

  onWindowClick($event: boolean) {
    this.windowClick.emit($event);
  }
}
