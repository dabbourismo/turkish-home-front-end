import { MatConfirmDialogComponent } from '@shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openConfirmDialog(msg) {
    return this.dialog.open(MatConfirmDialogComponent, {
      panelClass: 'confirm-dialog-container',
      width: '400px',
      disableClose: false,
      data: {
        message: msg,
      }
    });
  }
}
