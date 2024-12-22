import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostAdd } from '../../models/postAdd.model';
import { PostWithRemarks } from '../../models/postWithRemarks.model';
import { PostWithComments } from '../../models/postWithComments.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http: HttpClient = inject(HttpClient);
  BASEAPIURL = environment.BASEAPIURL + 'post/';

  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.BASEAPIURL + 'published');
  }
  getPublishedPostsWithFilter(filter: string): Observable<Post[]> {
    return this.http.get<Post[]>(
      this.BASEAPIURL + 'published?filter=' + filter
    );
  }
  addNewPost(
    post: PostAdd,
    username: string,
    id: number,
    email: string
  ): Observable<Post> {
    const headers = { username: username, id: id.toString(), email: email };
    return this.http.post<Post>(this.BASEAPIURL, post, { headers });
  }

  getConceptPosts(userid: number, username: string): Observable<Post[]> {
    const headers = { username: username, id: userid.toString() };
    return this.http.get<Post[]>(this.BASEAPIURL + 'concept', { headers });
  }
  getNoConceptPosts(userid: number, username: string): Observable<Post[]> {
    const headers = { username: username, id: userid.toString() };
    return this.http.get<Post[]>(this.BASEAPIURL + 'noconcept', { headers });
  }

  getPostById(
    postId: number,
    userid: number,
    username: string
  ): Observable<Post> {
    const headers = { username: username, id: userid.toString() };
    return this.http.get<Post>(this.BASEAPIURL + postId, { headers });
  }

  getPostByIdAndRemarks(
    postId: number,
    userid: number,
    username: string
  ): Observable<PostWithRemarks> {
    const headers = { username: username, id: userid.toString() };
    return this.http.get<PostWithRemarks>(
      this.BASEAPIURL + postId + '/withremarks',
      {
        headers,
      }
    );
  }

  getPostByIdAndComments(
    postId: number,
    userid: number,
    username: string
  ): Observable<PostWithComments> {
    const headers = { username: username, id: userid.toString() };
    return this.http.get<PostWithComments>(
      this.BASEAPIURL + postId + '/withcomments',
      {
        headers,
      }
    );
  }

  updatePost(post: Post, username: string, userid: number): Observable<Post> {
    const headers = { username: username, id: userid.toString() };
    return this.http.put<Post>(this.BASEAPIURL, post, { headers });
  }
  publishPost(
    postId: number,
    username: string,
    userid: number
  ): Observable<Post> {
    const headers = { username: username, id: userid.toString() };
    return this.http.post<Post>(
      this.BASEAPIURL + postId + '/publish',
      {},
      {
        headers,
      }
    );
  }
}
