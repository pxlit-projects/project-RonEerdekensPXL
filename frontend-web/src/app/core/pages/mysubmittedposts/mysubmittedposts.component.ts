import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-mysubmittedposts',
  standalone: true,
  imports: [],
  templateUrl: './mysubmittedposts.component.html',
  styleUrl: './mysubmittedposts.component.css',
})
export class MysubmittedpostsComponent {
  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  user: User | null | undefined;
}
