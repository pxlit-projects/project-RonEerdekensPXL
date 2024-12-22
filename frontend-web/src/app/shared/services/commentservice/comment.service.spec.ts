import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { CommentAdd } from '../../models/commentAdd.model';
import { Comment } from '../../models/comment.model';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  const BASEAPIURL = 'http://localhost:8083/api/comment/';
  const mockComment: CommentAdd = {
    comment: 'This is a test comment',
    postId: 1,
  };
  const mockComments: Comment[] = [
    {
      id: 1,
      comment: 'Comment 1',
      postId: 1,
      authorId: 1,
      creationDate: new Date(),
      author: 'Author 1',
    },
    {
      id: 2,
      comment: 'Comment 2',
      postId: 1,
      authorId: 1,
      creationDate: new Date(),
      author: 'Author 2',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add a comment', () => {
    const username = 'user1';
    const userId = 1;

    service.addComment(mockComment, username, userId).subscribe((comment) => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(BASEAPIURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush(mockComment);
  });

  it('should delete a comment', () => {
    const commentId = 1;
    const username = 'user1';
    const userId = 1;

    service.deleteComment(commentId, username, userId).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(BASEAPIURL + commentId);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush({});
  });

  it('should update a comment', () => {
    const commentId = 1;
    const username = 'user1';
    const userId = 1;

    service
      .updateComment(commentId, mockComment, username, userId)
      .subscribe((response) => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(BASEAPIURL + commentId);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush({});
  });

  it('should get comments of a user', () => {
    const username = 'user1';
    const userId = 1;

    service.getCommentsOfUser(username, userId).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(BASEAPIURL);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush(mockComments);
  });
});
