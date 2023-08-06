import {
  AfterViewInit,
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { TableService } from "./services/table.service";
import { Title } from "@angular/platform-browser";
import { MainTableWindowComponent } from "./components/main-table.component";
import { MatDialog } from "@angular/material/dialog";
import { AddActions, AddDialogComponent } from "./components/add-dialog-component";

@Component({
  selector: "bd-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, AfterViewInit {
  readonly title = "БД";
  windows: ComponentRef<MainTableWindowComponent>[] = [];
  @ViewChild("windows", { static: false })
  private windowsDiv: ElementRef<HTMLDivElement> | undefined;
  @ViewChild("container", { read: ViewContainerRef })
  private container: ViewContainerRef | undefined;

  constructor(
    private readonly tableService: TableService,
    private readonly titleService: Title,
    private readonly dialog: MatDialog,
  ) {
    this.titleService.setTitle(this.title);
  }

  addWindow() {
    if (!this.container) {
      console.error("CANNOT ADD WINDOW");
      return;
    }
    const componentRef = this.container.createComponent(MainTableWindowComponent);
    componentRef.instance.windowClick.subscribe(() => this.windowClick(componentRef));
    if (componentRef) this.windows.push(componentRef);
  }

  windowClick(componentRef: ComponentRef<MainTableWindowComponent>) {
    const otherWindows = this.windows.filter((component) => component !== componentRef);
    otherWindows.forEach((window) => {
      window.instance.zIndex = 0;
    });
    componentRef.instance.zIndex = 1;
  }

  ngOnInit() {
    console.log("onInit");
  }

  onSortClick(i: boolean) {
    this.sortNodes();
  }

  onAddClick(i: boolean) {
    // this.addWindow();
    // this.sortNodes();
    const dialogRef = this.dialog.open<AddDialogComponent, AddActions, AddActions>(
      AddDialogComponent,
    );
    dialogRef.afterClosed().subscribe((res) => {
      switch (res) {
        case AddActions.TABLE:
          this.addWindow();
          break;
      }
    });
  }

  ngAfterViewInit() {
    this.sortNodes();
  }

  private sortNodes() {
    if (!this.windowsDiv) return;
    const nodes = this.windowsDiv.nativeElement.querySelectorAll("bd-movable-window");
    const rows: HTMLDivElement[][] = [];
    for (let i = 0, j = 0, amount = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const htmlDivElement = node.querySelector<HTMLDivElement>(".movable");
      if (!htmlDivElement) continue;
      if (amount + htmlDivElement.offsetWidth >= window.innerWidth) {
        j += 1;
        amount = 0;
      }
      amount += htmlDivElement.offsetWidth + 5;
      if (!rows[j]) rows[j] = [];
      rows[j].push(htmlDivElement);
    }

    const maxRowsHeight = rows.map((row) =>
      row.reduce(
        (accum, element) => (element.offsetWidth > accum ? element.offsetWidth : accum),
        0,
      ),
    );

    rows.forEach((row, rowIndex) => {
      let amount = 0;
      row.forEach((element, i) => {
        element.style.left = `${amount + 5 * i}px`;
        amount += element.offsetWidth;
        element.style.top = `${
          this.getHeight(maxRowsHeight, rowIndex) + (rowIndex === 0 ? 45 : 5)
        }px`;
      });
    });
  }

  private getHeight(heights: number[], index: number) {
    let amount = 0;
    for (let i = 0; i < index; i++) {
      amount += heights[i];
    }

    return amount;
  }
}
