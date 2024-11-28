import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';

import { NewsComponent } from './core/pages/news/news.component';
import { MycommentsComponent } from './core/pages/mycomments/mycomments.component';
import { AddPostComponent } from './core/pages/add-post/add-post.component';
import { MyconceptsComponent } from './core/pages/myconcepts/myconcepts.component';
import { MysubmittedpostsComponent } from './core/pages/mysubmittedposts/mysubmittedposts.component';
import { ApprovingpostsComponent } from './core/pages/approvingposts/approvingposts.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Inloggen', component: LoginComponent },
  { path: 'nieuws', title: 'Nieuws', component: NewsComponent },
  {
    path: 'mijncomments',
    title: 'Mijn Comments',
    component: MycommentsComponent,
  },
  {
    path: 'berichtaanmaken',
    title: 'Bericht Aanmaken',
    component: AddPostComponent,
  },
  {
    path: 'mijnconcepten',
    title: 'Mijn Concepten',
    component: MyconceptsComponent,
  },
  {
    path: 'mijningediendeberichten',
    title: 'Mijn Ingediende Berichten',
    component: MysubmittedpostsComponent,
  },
  {
    path: 'berichtengoedkeuren',
    title: 'Berichten Goedkeuren',
    component: ApprovingpostsComponent,
  },
];
