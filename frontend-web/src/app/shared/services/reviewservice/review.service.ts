import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Post } from '../../models/post.model';
import { Observable } from 'rxjs';
import { RemarkAdd } from '../../models/remarkAdd.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  http: HttpClient = inject(HttpClient);
  BASEAPIURL = environment.BASEAPIURL + 'review/';

  getReviewPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.BASEAPIURL + 'posts');
  }
  approvePost(postId: number): Observable<any> {
    return this.http.post(this.BASEAPIURL + 'posts/' + postId + '/approve', {});
  }
  rejectPost(
    remark: RemarkAdd,
    username: string,
    userid: number
  ): Observable<any> {
    const headers = { username: username, id: userid.toString() };
    return this.http.post(
      this.BASEAPIURL + 'posts/' + remark.postId + '/reject',
      remark,
      { headers }
    );
  }
}
