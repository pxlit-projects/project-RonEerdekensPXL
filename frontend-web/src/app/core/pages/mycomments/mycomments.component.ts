import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Comment } from '../../../shared/models/comment.model';
import { CommentService } from '../../../shared/services/commentservice/comment.service';
import { PostService } from '../../../shared/services/postservice/post.service';

@Component({
  selector: 'app-mycomments',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatIconModule, RouterModule],
  templateUrl: './mycomments.component.html',
  styleUrl: './mycomments.component.css',
})
export class MycommentsComponent {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchUserComments();
  }

  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  commentService: CommentService = inject(CommentService);
  user: User | null | undefined;

  comments!: Comment[];

  fetchUserComments() {
    this.commentService
      .getCommentsOfUser(this.user!.username, this.user!.id)
      .subscribe({
        next: (data: Comment[]) => {
          this.comments = data;
          this.comments.sort((a, b) => {
            return (
              new Date(b.creationDate).getTime() -
              new Date(a.creationDate).getTime()
            );
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
