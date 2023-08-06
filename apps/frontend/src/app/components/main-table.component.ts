import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonUiModule } from "@bd/common-ui";
import { TableService } from "../services/table.service";

@Component({
  selector: "bd-main-table",
  template: ` <div class="main-table">
    <bd-table-picker (changeEvent)="onCurrentTableChange($event)"></bd-table-picker>
    <bd-source-table [currentTable$]="selected$"></bd-source-table>
  </div>`,
  styleUrls: ["./main-table.component.scss"],
  standalone: true,
  imports: [CommonUiModule],
})
export class MainTableComponent {
  constructor(private readonly tableService: TableService) {}

  get selected$() {
    return this.tableService.selected$;
  }

  onCurrentTableChange(value: string) {
    this.tableService.changeSelected(value);
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
