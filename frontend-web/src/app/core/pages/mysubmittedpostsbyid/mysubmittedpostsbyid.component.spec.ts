import { TestBed } from '@angular/core/testing';
import { MysubmittedpostsbyidComponent } from './mysubmittedpostsbyid.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostWithRemarks } from '../../../shared/models/postWithRemarks.model';
import { User } from '../../../shared/models/user.model';
import { Remark } from '../../../shared/models/remark.model';
import { Post } from '../../../shared/models/post.model';

describe('MysubmittedpostsbyidComponent', () => {
  let component: MysubmittedpostsbyidComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', [
      'getPostByIdAndRemarks',
      'updatePost',
      'publishPost',
      'savePost',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['params']);
    mockActivatedRoute.params = of({ postId: 1 });

    TestBed.configureTestingModule({
      imports: [MysubmittedpostsbyidComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const fixture = TestBed.createComponent(MysubmittedpostsbyidComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to /login if the user is not authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch and display the post when a postId is provided', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: PostWithRemarks = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'editor1',
      authorId: 1,
      state: 'SUBMITTED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
      remarks: [
        {
          id: 1,
          content: 'Test Remark',
          creationDate: new Date('2024-01-01'),
          postId: 1,
          reviewerId: 2,
          reviewer: 'editor2',
        },
      ],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockActivatedRoute.params = of({ postId: 1 });
    mockPostService.getPostByIdAndRemarks.and.returnValue(of(mockPost));

    component.ngOnInit();

    expect(mockPostService.getPostByIdAndRemarks).toHaveBeenCalledWith(
      1,
      1,
      'editor1'
    );
    expect(component.post).toEqual(mockPost);
  });

  it('should handle error if the post fetch fails', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    mockPostService.getPostByIdAndRemarks.and.returnValue(
      throwError(() => new Error('Error fetching post'))
    );

    component.user = mockUser;
    component.ngOnInit();

    expect(component.errorMessage).toBe('Error fetching post');
  });

  it('should reset the fields on cancel edit', () => {
    const mockPost: PostWithRemarks = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      authorId: 1,
      author: 'editor1',
      state: 'SUBMITTED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
      remarks: [],
    };

    component.post = mockPost;
    component.titleField = 'New Title';
    component.contentField = 'New Content';
    component.isEditing = true;

    component.onCancelEdit();

    expect(component.titleField).toBe(mockPost.title);
    expect(component.contentField).toBe(mockPost.content);
    expect(component.isEditing).toBe(false);
  });

  it('should update post and navigate on save', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: PostWithRemarks = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      authorId: 1,
      author: 'editor1',
      state: 'SUBMITTED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
      remarks: [],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.updatePost.and.returnValue(of(mockPost));

    component.user = mockUser;
    component.post = mockPost;
    component.titleField = 'Updated Title';
    component.contentField = 'Updated Content';

    component.onSave();

    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      mockPost,
      'editor1',
      1
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/mijningediendeberichten',
    ]);
  });

  it('should handle error if saving post fails', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: PostWithRemarks = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      authorId: 1,
      author: 'editor1',
      state: 'SUBMITTED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
      remarks: [],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.updatePost.and.returnValue(
      throwError(() => new Error('Error saving post'))
    );

    component.user = mockUser;
    component.post = mockPost;
    component.titleField = 'Updated Title';
    component.contentField = 'Updated Content';

    component.onSave();

    expect(component.errorMessage).toBe('Error saving post');
  });

  it('should publish post and navigate on success', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: PostWithRemarks = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'editor1',
      authorId: 1,
      state: 'SUBMITTED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
      remarks: [],
    };

    const mockPublishedPost: Post = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'editor1',
      authorId: 1,
      state: 'PUBLISHED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.publishPost.and.returnValue(of(mockPublishedPost));

    component.user = mockUser;
    component.post = mockPost;

    component.publishPost();

    expect(mockPostService.publishPost).toHaveBeenCalledWith(
      mockPost.id,
      mockUser.username,
      mockUser.id
    );

    expect(mockRouter.navigate).toHaveBeenCalledWith([
      '/mijningediendeberichten',
    ]);
  });

  it('should handle error if publishing post fails', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: PostWithRemarks = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      authorId: 1,
      author: 'editor1',
      state: 'SUBMITTED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
      remarks: [],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.publishPost.and.returnValue(
      throwError(() => new Error('Error publishing post'))
    );

    component.user = mockUser;
    component.post = mockPost;

    component.publishPost();

    expect(component.errorMessage).toBe('Error publishing post');
  });
});
