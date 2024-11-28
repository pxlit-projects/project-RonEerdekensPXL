import { Component, inject, Input, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
})
export class NavigationComponent {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  @Input() user: User | null | undefined;
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
