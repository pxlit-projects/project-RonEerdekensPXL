import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../../../shared/models/post.model';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { RejectPostDialogComponent } from '../../shared/components/reject-post-dialog/reject-post-dialog.component';

@Component({
  selector: 'app-approvingpostsbyid',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './approvingpostsbyid.component.html',
  styleUrl: './approvingpostsbyid.component.css',
})
export class ApprovingpostsbyidComponent implements OnInit {
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;

  dialog = inject(MatDialog);

  post!: Post;
  errorMessage: string = '';
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.route.params.subscribe((params) => {
      let postId = params['postId'];
      this.fetchPostById(postId);
    });
  }

  openDialog() {
    this.dialog.open(RejectPostDialogComponent, {
      data: {
        postId: this.post.id,
      },
    });
  }

  fetchPostById(postId: number) {
    this.postService
      .getPostById(postId, this.user!.id, this.user!.username)
      .subscribe((post) => {
        this.post = post;
      });
  }
  onBack() {
    this.router.navigate(['/berichtengoedkeuren']);
  }
}
