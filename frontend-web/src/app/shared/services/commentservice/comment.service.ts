import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentAdd } from '../../models/commentAdd.model';
import { Comment } from '../../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  http: HttpClient = inject(HttpClient);
  BASEAPIURL = 'http://localhost:8083/api/comment/';

  addComment(
    comment: CommentAdd,
    username: string,
    id: number
  ): Observable<CommentAdd> {
    const headers = { username: username, id: id.toString() };
    return this.http.post<CommentAdd>(this.BASEAPIURL, comment, { headers });
  }

  deleteComment(
    commentId: number,
    username: string,
    id: number
  ): Observable<any> {
    const headers = { username: username, id: id.toString() };
    return this.http.delete<any>(this.BASEAPIURL + commentId, { headers });
  }

  updateComment(
    commentId: number,
    comment: CommentAdd,
    username: string,
    id: number
  ): Observable<any> {
    const headers = { username: username, id: id.toString() };
    return this.http.put<any>(this.BASEAPIURL + commentId, comment, {
      headers,
    });
  }

  getCommentsOfUser(username: string, userId: number): Observable<Comment[]> {
    const headers = { username: username, id: userId.toString() };
    return this.http.get<Comment[]>(this.BASEAPIURL, { headers });
  }
}
