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

  post!: Post;
  errorMessage: string = '';
  isEditing: boolean = false;

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  fetchPostById(postId: number) {
    this.postService
      .getPostById(postId, this.user!.id, this.user!.username)
      .subscribe((post) => {
        if (post.authorId != this.user!.id) {
          this.router.navigate(['/mijningediendeberichten']);
        }
        this.post = post;
      });
  }
}
