import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { User } from '../../../../shared/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
})
export class CustomSidenavComponent implements OnInit {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }
  constructor(router: Router) {
    this.router.events.subscribe(() => {
      this.user = this.authService.getCurrentUser();
    });
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  login() {
    this.router.navigate(['/login']);
  }
}
