import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MovableWindowComponent } from "./movable-window.component";

describe("MovableWindowComponent", () => {
  let component: MovableWindowComponent;
  let fixture: ComponentFixture<MovableWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovableWindowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MovableWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
