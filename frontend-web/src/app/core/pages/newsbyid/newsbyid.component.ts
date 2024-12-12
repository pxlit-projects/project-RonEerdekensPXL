import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { PostWithComments } from '../../../shared/models/postWithComments.model';
import { Comment } from '../../../shared/models/comment.model';

@Component({
  selector: 'app-newsbyid',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './newsbyid.component.html',
  styleUrl: './newsbyid.component.css',
})
export class NewsbyidComponent implements OnInit {
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

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;

  post!: PostWithComments;
  errorMessage: string = '';

  fetchPostById(postId: number) {
    this.postService
      .getPostByIdAndComments(postId, this.user!.id, this.user!.username)
      .subscribe((post) => {
        this.post = post;
        this.post.comments.sort((a: Comment, b: Comment) => {
          return (
            new Date(b.creationDate).getTime() -
            new Date(a.creationDate).getTime()
          );
        });
      });
  }

  onBack() {
    this.router.navigate(['/nieuws']);
  }
}
