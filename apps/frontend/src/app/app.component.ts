import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
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
export class AppComponent implements OnInit, AfterViewInit {
  readonly title = "БД";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  @ViewChild("windows", { static: false })
  private windowsDiv: ElementRef<HTMLDivElement> | undefined;

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
    console.log("onInit");
  }

  onSortClick(i: boolean) {
    this.sortNodes();
  }

  ngAfterViewInit() {
    this.sortNodes();
  }

  private sortNodes() {
    if (!this.windowsDiv) return;
    const nodes = this.windowsDiv.nativeElement.querySelectorAll("bd-movable-window");
    let amount = 0;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const movableDiv = node.querySelector<HTMLDivElement>(".movable");
      if (!movableDiv) continue;
      movableDiv.style.left = `${amount + (i === 0 ? 0 : 5)}px`;
      movableDiv.style.top = `50px`;
      amount += movableDiv.offsetWidth;
    }
  }
}
