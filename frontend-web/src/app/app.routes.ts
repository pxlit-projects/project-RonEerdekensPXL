import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';

import { PostsComponent } from './core/pages/posts/posts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Inloggen', component: LoginComponent },
  { path: 'nieuws', title: 'Nieuws', component: PostsComponent },
];
