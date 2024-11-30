import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { PostService } from '../../../shared/services/postservice/post.service';
import { Post } from '../../../shared/models/post.model';

@Component({
  selector: 'app-mysubmittedposts',
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatIconModule,
    MatChipsModule,
    CommonModule,
  ],
  templateUrl: './mysubmittedposts.component.html',
  styleUrl: './mysubmittedposts.component.css',
})
export class MysubmittedpostsComponent {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchNoConceptPosts();
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;

  posts!: Post[];

  fetchNoConceptPosts(): void {
    this.postService
      .getNoConceptPosts(this.user!.id, this.user!.username)
      .subscribe({
        next: (data: Post[]) => {
          this.posts = data;
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
