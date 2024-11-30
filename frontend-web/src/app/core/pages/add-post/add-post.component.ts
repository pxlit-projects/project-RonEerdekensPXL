import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { PostAdd } from '../../../shared/models/postAdd.model';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css',
})
export class AddPostComponent {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
    if (this.user!.role !== 'editor') {
      this.router.navigate(['/nieuws']);
    }
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  user: User | null | undefined;
  titleField: string = '';
  contentField: string = '';
  errorMessage: string = '';
  statusField: string = '';
  onAddPost(arg0: any) {
    let post: PostAdd = {
      title: this.titleField,
      content: this.contentField,
      state: this.statusField,
    };

    this.postService
      .addNewPost(post, this.user!.username, this.user!.id)
      .subscribe({
        next: (data: Post) => {
          if (this.user!.role === 'editor') {
            if (data.state === 'CONCEPT') {
              this.router.navigate(['/mijnconcepten']);
            } else {
              this.router.navigate(['/mijningediendeberichten']);
            }
          } else {
            this.router.navigate(['/nieuws']);
          }
        },
        error: (error) => {
          this.errorMessage = String(error).replace('Error: ', '');
        },
      });
  }
}
