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
import { PostWithRemarks } from '../../../shared/models/postWithRemarks.model';
import { Remark } from '../../../shared/models/remark.model';

@Component({
  selector: 'app-mysubmittedpostsbyid',
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
  templateUrl: './mysubmittedpostsbyid.component.html',
  styleUrl: './mysubmittedpostsbyid.component.css',
})
export class MysubmittedpostsbyidComponent implements OnInit {
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

  post!: PostWithRemarks;
  errorMessage: string = '';
  isEditing: boolean = false;
  titleField: string = '';
  contentField: string = '';
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
  onCancelEdit() {
    this.titleField = this.post.title;
    this.contentField = this.post.content;
    this.toggleEdit();
  }
  onSave() {
    this.post.title = this.titleField;
    this.post.content = this.contentField;
    this.post.state = 'SUBMITTED';
    this.savePost();
  }
  onBack() {
    this.router.navigate(['/mijningediendeberichten']);
  }

  fetchPostById(postId: number) {
    this.postService
      .getPostByIdAndRemarks(postId, this.user!.id, this.user!.username)
      .subscribe((post) => {
        if (post.authorId != this.user!.id) {
          this.router.navigate(['/mijningediendeberichten']);
        }
        this.post = post;
        this.titleField = this.post.title;
        this.contentField = this.post.content;
        this.post.remarks.sort((a: Remark, b: Remark) => {
          return (
            new Date(b.creationDate).getTime() -
            new Date(a.creationDate).getTime()
          );
        });
      });
  }
  publishPost() {
    this.postService
      .publishPost(this.post.id, this.user!.username, this.user!.id)
      .subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/mijningediendeberichten']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }
  private savePost() {
    this.postService
      .updatePost(this.post, this.user!.username, this.user!.id)
      .subscribe({
        next: () => {
          this.errorMessage = '';
          this.router.navigate(['/mijningediendeberichten']);
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }
}
