import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";

interface Table {
  name: string;
  ref: string;
}

@Component({
  selector: "bd-table-picker",
  templateUrl: "./table-picker.component.html",
  styleUrls: ["./table-picker.component.scss"],
})
export class TablePickerComponent implements OnInit, OnDestroy {
  selected$ = new BehaviorSubject<string>("");
  destroy$ = new Subject();

  @Input({}) options: Table[] = [];
  @Output() changeEvent = new EventEmitter<string>();

  onSelectedValueChange(value: string) {
    this.selected$.next(value);
  }

  ngOnInit() {
    this.selected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.changeEvent.emit(value));
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }
}
