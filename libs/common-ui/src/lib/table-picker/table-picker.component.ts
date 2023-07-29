import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";

@Component({
  selector: "bd-table-picker",
  templateUrl: "./table-picker.component.html",
  styleUrls: ["./table-picker.component.scss"],
})
export class TablePickerComponent implements OnInit, OnDestroy {
  selected$ = new BehaviorSubject<string>("");
  destroy$ = new Subject();
  options: string[] = [];

  @Output() changeEvent = new EventEmitter<string>();

  onSelectedValueChange(value: string) {
    this.selected$.next(value);
  }

  ngOnInit() {
    console.log();
    for (let i = 0; i < 5; i++) {
      this.options.push(`option-${i + 1}`);
    }

    this.selected$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.changeEvent.emit(value));
  }

  ngOnDestroy() {
    this.destroy$.next(null);
  }
}
