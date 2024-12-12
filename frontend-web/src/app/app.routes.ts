import { Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';

import { NewsComponent } from './core/pages/news/news.component';
import { MycommentsComponent } from './core/pages/mycomments/mycomments.component';
import { AddPostComponent } from './core/pages/add-post/add-post.component';
import { MyconceptsComponent } from './core/pages/myconcepts/myconcepts.component';
import { MysubmittedpostsComponent } from './core/pages/mysubmittedposts/mysubmittedposts.component';
import { ApprovingpostsComponent } from './core/pages/approvingposts/approvingposts.component';
import { MyconceptbyidComponent } from './core/pages/myconceptbyid/myconceptbyid.component';
import { MysubmittedpostsbyidComponent } from './core/pages/mysubmittedpostsbyid/mysubmittedpostsbyid.component';
import { ApprovingpostsbyidComponent } from './core/pages/approvingpostsbyid/approvingpostsbyid.component';
import { NewsbyidComponent } from './core/pages/newsbyid/newsbyid.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Inloggen', component: LoginComponent },
  { path: 'nieuws', title: 'Nieuws', component: NewsComponent },
  { path: 'nieuws/:postId', title: 'Nieuws', component: NewsbyidComponent },
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
    path: 'mijnconcepten/:postId',
    title: 'Mijn Concept',
    component: MyconceptbyidComponent,
  },
  {
    path: 'mijningediendeberichten',
    title: 'Mijn Ingediende Berichten',
    component: MysubmittedpostsComponent,
  },
  {
    path: 'mijningediendeberichten/:postId',
    title: 'Mijn Ingediende Berichten',
    component: MysubmittedpostsbyidComponent,
  },
  {
    path: 'berichtengoedkeuren',
    title: 'Berichten Goedkeuren',
    component: ApprovingpostsComponent,
  },
  {
    path: 'berichtengoedkeuren/:postId',
    title: 'Berichten Goedkeuren',
    component: ApprovingpostsbyidComponent,
  },
];
