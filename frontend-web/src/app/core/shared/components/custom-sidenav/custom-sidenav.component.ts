import { Component, inject, Input, input, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { User } from '../../../../shared/models/user.model';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [MatButtonModule, MatListModule, MatIconModule, RouterModule],
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
  sidNavCollapsed = signal(false);
  @Input() set collapsed(value: boolean) {
    this.sidNavCollapsed.set(value);
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
