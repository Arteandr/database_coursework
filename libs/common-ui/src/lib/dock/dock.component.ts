import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "bd-dock",
  templateUrl: "./dock.component.html",
  styleUrls: ["./dock.component.scss"],
})
export class DockComponent {
  @Output() addButtonClick = new EventEmitter<boolean>();
  @Output() sortButtonClick = new EventEmitter<boolean>();
}
