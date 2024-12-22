import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { Post } from '../../models/post.model';
import { RemarkAdd } from '../../models/remarkAdd.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  const BASEAPIURL = 'http://localhost:8083/api/review/';
  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    authorId: 1,
    state: 'SUBMIED',
    creationDate: null,
    publicationDate: null,
    author: 'editor1',
    category: 'ALGEMEEN',
  };
  const mockPosts: Post[] = [mockPost];
  const mockRemarkAdd: RemarkAdd = {
    postId: 1,
    content: 'This post is rejected due to issues.',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService],
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve review posts', () => {
    service.getReviewPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(BASEAPIURL + 'posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should approve a post', () => {
    const postId = 1;

    service.approvePost(postId).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(BASEAPIURL + 'posts/' + postId + '/approve');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should reject a post with a remark', () => {
    const username = 'user1';
    const userId = 1;

    service
      .rejectPost(mockRemarkAdd, username, userId)
      .subscribe((response) => {
        expect(response).toEqual({});
      });

    const req = httpMock.expectOne(
      BASEAPIURL + 'posts/' + mockRemarkAdd.postId + '/reject'
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush({});
  });
});
