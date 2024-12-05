import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-reject-post-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './reject-post-dialog.component.html',
  styleUrl: './reject-post-dialog.component.css',
})
export class RejectPostDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RejectPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postId = data.postId;
  }

  postId: number = 0;
}
