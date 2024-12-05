import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Post } from '../../models/post.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  http: HttpClient = inject(HttpClient);
  BASEAPIURL = 'http://localhost:8083/api/review/';

  getReviewPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.BASEAPIURL + 'posts');
  }
  approvePost(postId: number): Observable<any> {
    return this.http.post(this.BASEAPIURL + 'posts/' + postId + '/approve', {});
  }
}
