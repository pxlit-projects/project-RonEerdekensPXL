import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http: HttpClient = inject(HttpClient);
  BASEAPIURL = 'http://localhost:8083/api/post/';

  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.BASEAPIURL + 'published');
  }
}
