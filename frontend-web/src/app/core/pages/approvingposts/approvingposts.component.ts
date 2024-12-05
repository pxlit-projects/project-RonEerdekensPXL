import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { DatePipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../../shared/models/post.model';
import { ReviewService } from '../../../shared/services/reviewservice/review.service';

@Component({
  selector: 'app-approvingposts',
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './approvingposts.component.html',
  styleUrl: './approvingposts.component.css',
})
export class ApprovingpostsComponent {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchReviewPosts();
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  reviewService: ReviewService = inject(ReviewService);
  user: User | null | undefined;
  posts!: Post[];

  fetchReviewPosts(): void {
    this.reviewService.getReviewPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        this.posts = this.posts.filter(
          (post) => post.authorId != this.user!.id
        );
        this.posts.sort((a, b) => {
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
