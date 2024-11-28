import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';

import { PostsComponent } from './core/pages/posts/posts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'nieuws', component: PostsComponent },
];
