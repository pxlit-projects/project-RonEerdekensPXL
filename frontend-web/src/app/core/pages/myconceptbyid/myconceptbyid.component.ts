import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-myconceptbyid',
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
  templateUrl: './myconceptbyid.component.html',
  styleUrl: './myconceptbyid.component.css',
})
export class MyconceptbyidComponent implements OnInit {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user == null) {
      this.router.navigate(['/login']);
      return;
    }
    this.route.params.subscribe((params) => {
      let postId = params['postId'];
      this.fetchPostById(postId);
    });
  }
  fetchPostById(postId: number) {
    this.postService
      .getPostById(postId, this.user!.id, this.user!.username)
      .subscribe({
        next: (post: Post) => {
          if (post.authorId != this.user!.id) {
            this.router.navigate(['/mijnconcepten']);
          }
          this.post = post;
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;

  post!: Post;
  errorMessage: string = '';

  onSave() {
    this.savePost();
  }
  onSubmit() {
    this.post.state = 'SUBMITTED';
    this.savePost();
  }
  onBack() {
    this.router.navigate(['/mijnconcepten']);
  }

  savePost() {
    this.postService
      .updatePost(this.post, this.user!.username, this.user!.id)
      .subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/mijnconcepten']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
