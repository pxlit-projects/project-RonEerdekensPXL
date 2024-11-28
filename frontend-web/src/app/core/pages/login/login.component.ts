import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { User } from '../../../shared/models/user.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  usernameField: string = '';
  passwordField: string = '';

  errorMessage: string = '';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.router.navigate(['/posts']);
    }
  }

  onLogin(data: Object): void {
    try {
      this.authService.setCurrentUser(this.usernameField, this.passwordField);
      this.router.navigate(['/posts']);
    } catch (error: any) {
      this.errorMessage = String(error).replace('Error: ', '');
    }
  }
}
