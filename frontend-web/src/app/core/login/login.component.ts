import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);

  usernameField: string = '';
  passwordField: string = '';

  errorMessage: string = '';

  onLogin(data: Object): void {
    try {
      this.authService.setCurrentUser(this.usernameField, this.passwordField);
    } catch (error: any) {
      this.errorMessage = String(error).replace('Error: ', '');
    }
  }
}
