import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/postservice/post.service';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatIconModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchPublishedPosts();
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;

  posts!: Post[];

  fetchPublishedPosts(): void {
    this.postService.getPublishedPosts().subscribe({
      next: (data: Post[]) => {
        this.posts = data;
        this.posts.sort((a, b) => {
          return (
            new Date(b.publicationDate).getTime() -
            new Date(a.publicationDate).getTime()
          );
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
