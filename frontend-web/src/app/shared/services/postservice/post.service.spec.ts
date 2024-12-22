import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from '../../models/post.model';
import { PostAdd } from '../../models/postAdd.model';
import { PostWithRemarks } from '../../models/postWithRemarks.model';
import { PostWithComments } from '../../models/postWithComments.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const BASEAPIURL = 'http://localhost:8083/api/post/';
  const mockPost: Post = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    authorId: 1,
    state: 'CONCEPT',
    creationDate: new Date(),
    publicationDate: new Date(),
    author: 'Author 1',
    category: 'Category 1',
  };
  const mockPosts: Post[] = [mockPost];
  const mockPostAdd: PostAdd = {
    title: 'New Post',
    content: 'This is a new post.',
    state: 'CONCEPT',
    category: 'Category 1',
  };
  const mockPostWithRemarks: PostWithRemarks = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    authorId: 1,
    state: 'CONCEPT',
    creationDate: new Date(),
    publicationDate: new Date(),
    author: 'Author 1',
    category: 'Category 1',
    remarks: [
      {
        id: 1,
        content: 'Remark 1',
        postId: 1,
        creationDate: new Date(),
        reviewerId: 1,
        reviewer: 'Reviewer 1',
      },
    ],
  };
  const mockPostWithComments: PostWithComments = {
    id: 1,
    title: 'Test Post',
    content: 'This is a test post.',
    authorId: 1,
    state: 'CONCEPT',
    creationDate: new Date(),
    publicationDate: new Date(),
    author: 'Author 1',
    category: 'Category 1',
    comments: [
      {
        id: 1,
        comment: 'Comment 1',
        postId: 1,
        creationDate: new Date(),
        authorId: 1,
        author: 'Author 1',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get published posts', () => {
    service.getPublishedPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(BASEAPIURL + 'published');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should get published posts with a filter', () => {
    const filter = 'test';
    service.getPublishedPostsWithFilter(filter).subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(BASEAPIURL + 'published?filter=' + filter);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should add a new post', () => {
    const username = 'user1';
    const userId = 1;
    const email = 'test@example.com';

    service
      .addNewPost(mockPostAdd, username, userId, email)
      .subscribe((post) => {
        expect(post).toEqual(mockPost);
      });

    const req = httpMock.expectOne(BASEAPIURL);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    expect(req.request.headers.get('email')).toBe(email);
    req.flush(mockPost);
  });

  it('should get concept posts', () => {
    const userId = 1;
    const username = 'user1';

    service.getConceptPosts(userId, username).subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(BASEAPIURL + 'concept');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush(mockPosts);
  });

  it('should get posts without concept', () => {
    const userId = 1;
    const username = 'user1';

    service.getNoConceptPosts(userId, username).subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(BASEAPIURL + 'noconcept');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush(mockPosts);
  });

  it('should get post by ID', () => {
    const postId = 1;
    const userId = 1;
    const username = 'user1';

    service.getPostById(postId, userId, username).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(BASEAPIURL + postId);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('username')).toBe(username);
    expect(req.request.headers.get('id')).toBe(userId.toString());
    req.flush(mockPost);
  });

  it('should get post by ID with remarks', () => {
    const postId = 1;
    const userId = 1;
    const username = 'user1';

    service
      .getPostByIdAndRemarks(postId, userId, username)
      .subscribe((post) => {
        expect(post).toEqual(mockPostWithRemarks);
      });

    const req = httpMock.expectOne(BASEAPIURL + postId + '/withremarks');
    expect(req.request.method).toBe('GET');
    req.flush(mockPostWithRemarks);
  });

  it('should get post by ID with comments', () => {
    const postId = 1;
    const userId = 1;
    const username = 'user1';

    service
      .getPostByIdAndComments(postId, userId, username)
      .subscribe((post) => {
        expect(post).toEqual(mockPostWithComments);
      });

    const req = httpMock.expectOne(BASEAPIURL + postId + '/withcomments');
    expect(req.request.method).toBe('GET');
    req.flush(mockPostWithComments);
  });

  it('should update a post', () => {
    const userId = 1;
    const username = 'user1';

    service.updatePost(mockPost, username, userId).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(BASEAPIURL);
    expect(req.request.method).toBe('PUT');
    req.flush(mockPost);
  });

  it('should publish a post', () => {
    const postId = 1;
    const userId = 1;
    const username = 'user1';

    service.publishPost(postId, username, userId).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(BASEAPIURL + postId + '/publish');
    expect(req.request.method).toBe('POST');
    req.flush(mockPost);
  });
});
