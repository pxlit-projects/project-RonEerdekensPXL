import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../../shared/models/user.model';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { ReviewService } from '../../../../shared/services/reviewservice/review.service';
import { RemarkAdd } from '../../../../shared/models/remarkAdd.model';

@Component({
  selector: 'app-reject-post-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './reject-post-dialog.component.html',
  styleUrl: './reject-post-dialog.component.css',
})
export class RejectPostDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RejectPostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.postId = data.postId;
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  reviewService: ReviewService = inject(ReviewService);
  user: User | null | undefined;

  postId: number = 0;
  comment: string = '';
  onReject() {
    let remark: RemarkAdd = {
      content: this.comment,
      postId: this.postId,
    };
    this.reviewService
      .rejectPost(remark, this.user!.username, this.user!.id)
      .subscribe({
        next: (data) => {
          setTimeout(() => {
            this.dialogRef.close();
            this.router.navigate(['/berichtengoedkeuren']);
          }, 1000);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
