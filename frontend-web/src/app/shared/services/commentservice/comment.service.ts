import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentAdd } from '../../models/commentAdd.model';

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
}
