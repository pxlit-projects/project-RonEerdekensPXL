import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);

  username: string = '';
  password: string = '';

  errorMessage: string = '';

  onLogin(data: Object): void {
    try {
      this.authService.setCurrentUser(this.username, this.password);
    } catch (error: any) {
      this.errorMessage = error.Error;
    }
  }
}
