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
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CommentAdd } from '../../../shared/models/commentAdd.model';
import { CommentService } from '../../../shared/services/commentservice/comment.service';

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
    ReactiveFormsModule,
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
    this.commentForm = new FormGroup({
      comment: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  commentService: CommentService = inject(CommentService);
  user: User | null | undefined;

  post!: PostWithComments;
  errorMessage: string = '';

  commentForm!: FormGroup;

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
  onDeleteComment(commentId: number) {
    this.commentService
      .deleteComment(commentId, this.user!.username, this.user!.id)
      .subscribe({
        next: () => {
          this.fetchPostById(this.post.id);
        },
        error: (error) => {
          this.errorMessage = error.message;
        },
      });
  }
  onSubmit() {
    if (this.commentForm.valid) {
      const comment: CommentAdd = {
        postId: this.post.id,
        comment: this.commentForm.get('comment')!.value,
      };
      this.commentService
        .addComment(comment, this.user!.username, this.user!.id)
        .subscribe({
          next: () => {
            this.commentForm.reset();
            this.fetchPostById(this.post.id);
          },
          error: (error) => {
            this.errorMessage = error.message;
          },
        });
    } else {
      this.errorMessage = 'Vul een commentaar in met minimaal 5 karakters.';
    }
  }
}
