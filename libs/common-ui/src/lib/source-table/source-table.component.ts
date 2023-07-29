import { Component, DoCheck, Input, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { BehaviorSubject, interval, Observable } from "rxjs";

@Component({
  selector: "bd-source-table",
  templateUrl: "./source-table.component.html",
  styleUrls: ["./source-table.component.scss"],
})
export class SourceTableComponent implements DoCheck, OnInit {
  dataSource = new MatTableDataSource([
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 23,
    },
    {
      name: "aboba",
      age: 22,
    },
  ]);
  displayedColumns: string[] = [];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  loading$ = new BehaviorSubject<boolean>(false);
  @Input() currentTable$: Observable<string> = new Observable<string>();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @ViewChild(MatPaginator, { static: false }) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }

  ngDoCheck() {
    this.generateColumns();
  }

  onChangeTable(table: string) {
    console.log("change");
    this.loading$.next(true);
    interval(3000).subscribe(() => {
      this.loading$.next(false);
    });
  }

  ngOnInit(): void {
    this.currentTable$.subscribe({
      next: (val) => this.onChangeTable(val),
    });
  }

  private generateColumns() {
    const set = new Set<string>();
    this.dataSource.data.forEach((obj) => {
      Object.keys(obj).forEach((k) => set.add(k));
    });

    this.displayedColumns = Array.from(set);
  }
}
