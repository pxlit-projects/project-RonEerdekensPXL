import { TestBed } from '@angular/core/testing';
import { NewsbyidComponent } from './newsbyid.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { CommentService } from '../../../shared/services/commentservice/comment.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { PostWithComments } from '../../../shared/models/postWithComments.model';
import { Comment } from '../../../shared/models/comment.model';

describe('NewsbyidComponent', () => {
  let component: NewsbyidComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', [
      'getPostByIdAndComments',
    ]);
    mockCommentService = jasmine.createSpyObj('CommentService', [
      'addComment',
      'deleteComment',
      'updateComment',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['params']);
    mockActivatedRoute.params = of({ postId: 1 });

    TestBed.configureTestingModule({
      imports: [NewsbyidComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: CommentService, useValue: mockCommentService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const fixture = TestBed.createComponent(NewsbyidComponent);
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
      username: 'testuser',
      role: 'user',
      password: 'password',
      email: 'testuser@example.com',
    };

    const mockPost: PostWithComments = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'testuser',
      authorId: 1,
      state: 'PUBLISHED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'GENERAL',
      comments: [
        {
          id: 1,
          comment: 'Great post!',
          creationDate: new Date(),
          postId: 1,
          authorId: 1,
          author: 'testuser',
        },
      ],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockActivatedRoute.params = of({ postId: 1 });
    mockPostService.getPostByIdAndComments.and.returnValue(of(mockPost));

    component.ngOnInit();

    expect(mockPostService.getPostByIdAndComments).toHaveBeenCalledWith(
      1,
      1,
      'testuser'
    );
    expect(component.post).toEqual(mockPost);
  });

  it('should handle error if fetching the post fails', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'user',
      password: 'password',
      email: 'testuser@example.com',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostByIdAndComments.and.returnValue(
      throwError(() => new Error('Error fetching post'))
    );

    component.ngOnInit();

    expect(component.errorMessage).toBe('Error fetching post');
  });

  it('should submit a comment successfully', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'editor',
      password: 'password',
      email: 'testuser@example.com',
    };

    const mockPost: PostWithComments = {
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      author: 'testuser',
      authorId: 1,
      state: 'PUBLISHED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'General',
      comments: [],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostByIdAndComments.and.returnValue(of(mockPost));
    mockCommentService.addComment.and.returnValue(
      of({
        postId: 1,
        comment: 'This is a comment',
      })
    );

    component.ngOnInit();

    component.commentForm.get('comment')?.setValue('This is a comment');

    component.onSubmit();

    expect(mockCommentService.addComment).toHaveBeenCalledWith(
      jasmine.objectContaining({
        postId: 1,
        comment: 'This is a comment',
      }),
      mockUser.username,
      mockUser.id
    );

    expect(mockPostService.getPostByIdAndComments).toHaveBeenCalledWith(
      1,
      mockUser.id,
      mockUser.username
    );
  });

  it('should handle error when submitting a comment', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'editor',
      password: 'password',
      email: 'testuser@example.com',
    };

    const mockPost: PostWithComments = {
      id: 1,
      title: 'Test Post',
      content: 'Test content',
      author: 'testuser',
      authorId: 1,
      state: 'PUBLISHED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'General',
      comments: [],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostByIdAndComments.and.returnValue(of(mockPost));

    mockCommentService.addComment.and.returnValue(
      throwError(() => new Error('Error submitting comment'))
    );

    component.ngOnInit();

    component.commentForm.get('comment')?.setValue('This is a comment');

    component.onSubmit();

    expect(component.errorMessage).toBe('Error submitting comment');
  });

  it('should delete a comment successfully', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'user',
      password: 'password',
      email: 'testuser@example.com',
    };

    const mockPost: PostWithComments = {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      author: 'testuser',
      authorId: 1,
      state: 'PUBLISHED',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'GENERAL',
      comments: [
        {
          id: 1,
          comment: 'Great post!',
          creationDate: new Date(),
          postId: 1,
          authorId: 1,
          author: 'testuser',
        },
      ],
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostByIdAndComments.and.returnValue(of(mockPost));
    mockCommentService.deleteComment.and.returnValue(of({}));

    component.ngOnInit();

    component.onDeleteComment(1);

    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(
      1,
      'testuser',
      1
    );
  });

  it('should handle error when deleting a comment', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'user',
      password: 'password',
      email: 'testuser@example.com',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockCommentService.deleteComment.and.returnValue(
      throwError(() => new Error('Error deleting comment'))
    );

    component.user = mockUser;
    component.onDeleteComment(1);

    expect(component.errorMessage).toBe('Error deleting comment');
  });
});
