import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { fromEvent, map, Observable, switchMap, takeUntil } from "rxjs";

@Component({
  selector: "bd-movable-window",
  templateUrl: "./movable-window.component.html",
  styleUrls: ["./movable-window.component.scss"],
})
export class MovableWindowComponent implements AfterViewInit {
  @Output() windowClick = new EventEmitter<boolean>();
  @Input() zIndex = 0;
  @ViewChild("header", { static: false }) headerEl: ElementRef<HTMLElement> | undefined;
  @ViewChild("movable", { static: false }) movableEl: ElementRef<HTMLDivElement> | undefined;
  private mouseUp$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, "mouseup");
  private mouseMove$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, "mousemove");

  ngAfterViewInit() {
    this.initDrag();
  }

  onWindowClick() {
    this.windowClick.emit(true);
  }

  onCloseButtonClick(event: Event) {
    this.movableEl?.nativeElement.closest("bd-movable-window")?.remove();
  }

  private initDrag() {
    if (!this.headerEl || !this.movableEl) return;

    const dragStart$ = fromEvent<MouseEvent>(this.headerEl.nativeElement, "mousedown");
    const dragMove$ = dragStart$.pipe(
      switchMap((start) =>
        this.mouseMove$.pipe(
          map((moveEvent) => ({
            originalEvent: moveEvent,
            deltaX: moveEvent.pageX - start.pageX,
            deltaY: moveEvent.pageY - start.pageY,
            startOffsetX: start.offsetX,
            startOffsetY: start.offsetY,
          })),
          takeUntil(this.mouseUp$),
        ),
      ),
    );

    dragMove$.subscribe((move) => {
      this.windowClick.emit(true);
      const offsetX = move.originalEvent.x - move.startOffsetX;
      const offsetY = move.originalEvent.y - move.startOffsetY;
      if (!this.movableEl) return;
      this.movableEl.nativeElement.style.left = offsetX + "px";
      this.movableEl.nativeElement.style.top = offsetY + "px";
    });
  }
}
