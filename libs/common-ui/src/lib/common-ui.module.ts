import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SourceTableComponent } from "./source-table/source-table.component";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { TablePickerComponent } from "./table-picker/table-picker.component";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MovableWindowComponent } from "./movable-window/movable-window.component";
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { DockComponent } from "./dock/dock.component";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    CdkDrag,
    CdkDragHandle,
    MatIconModule,
  ],
  declarations: [SourceTableComponent, TablePickerComponent, MovableWindowComponent, DockComponent],
  exports: [SourceTableComponent, TablePickerComponent, MovableWindowComponent, DockComponent],
})
export class CommonUiModule {}
