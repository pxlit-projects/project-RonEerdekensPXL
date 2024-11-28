import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/postservice/post.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [],
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
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
