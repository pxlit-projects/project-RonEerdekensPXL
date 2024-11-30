import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { MatCardModule } from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Post } from '../../../shared/models/post.model';
import { PostService } from '../../../shared/services/postservice/post.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-myconcepts',
  standalone: true,
  imports: [MatCardModule, DatePipe, MatIconModule, MatChipsModule],
  templateUrl: './myconcepts.component.html',
  styleUrl: './myconcepts.component.css',
})
export class MyconceptsComponent {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.fetchConceptPosts();
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;

  posts!: Post[];
  fetchConceptPosts(): void {
    this.postService
      .getConceptPosts(this.user!.id, this.user!.username)
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
