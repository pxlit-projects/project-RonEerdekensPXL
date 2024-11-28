import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-myconcepts',
  standalone: true,
  imports: [],
  templateUrl: './myconcepts.component.html',
  styleUrl: './myconcepts.component.css',
})
export class MyconceptsComponent {
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
