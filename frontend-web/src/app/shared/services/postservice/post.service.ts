import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostAdd } from '../../models/postAdd.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  http: HttpClient = inject(HttpClient);
  BASEAPIURL = 'http://localhost:8083/api/post/';

  getPublishedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.BASEAPIURL + 'published');
  }
  addNewPost(post: PostAdd, username: string, id: number): Observable<Post> {
    const headers = { username: username, id: id.toString() };
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
  updatePost(post: Post, username: string, userid: number): Observable<Post> {
    const headers = { username: username, id: userid.toString() };
    return this.http.put<Post>(this.BASEAPIURL, post, { headers });
  }
}
