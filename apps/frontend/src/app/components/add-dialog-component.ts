import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

export enum AddActions {
  TABLE,
}

interface AddData {
  action: AddActions;
}

@Component({
  selector: "bd-add-dialog",
  templateUrl: "add-dialog.component.html",
  styleUrls: ["add-dialog-component.scss"],
  standalone: true,
  imports: [MatDialogModule, MatInputModule, MatButtonModule],
})
export class AddDialogComponent {
  protected readonly AddActions = AddActions;

  constructor(
    public dialogRef: MatDialogRef<AddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddData,
  ) {}

  onChoose(action: AddActions) {
    this.dialogRef.close(action);
  }
}
