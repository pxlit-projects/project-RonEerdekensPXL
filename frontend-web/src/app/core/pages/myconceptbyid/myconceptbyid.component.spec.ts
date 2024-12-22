import { TestBed } from '@angular/core/testing';
import { MyconceptbyidComponent } from './myconceptbyid.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { User } from '../../../shared/models/user.model';

describe('MyconceptbyidComponent', () => {
  let component: MyconceptbyidComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', [
      'getPostById',
      'updatePost',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['params']);
    mockActivatedRoute.params = of({ postId: 1 });

    TestBed.configureTestingModule({
      imports: [MyconceptbyidComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    const fixture = TestBed.createComponent(MyconceptbyidComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to /login if the user is not authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch and display the post if the user is authenticated and the post is authored by the user', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: Post = {
      id: 1,
      title: 'Post Title',
      content: 'Post Content',
      authorId: 1,
      author: 'editor1',
      state: 'CONCEPT',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockActivatedRoute.params = of({ postId: 1 });
    mockPostService.getPostById.and.returnValue(of(mockPost));

    component.ngOnInit();

    expect(mockPostService.getPostById).toHaveBeenCalledWith(1, 1, 'editor1');
    expect(component.post).toEqual(mockPost);
  });

  it('should redirect to /mijnconcepten if the post is not authored by the user', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: Post = {
      id: 1,
      title: 'Post Title',
      content: 'Post Content',
      authorId: 2, // Different author ID
      author: 'editor2',
      state: 'CONCEPT',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockActivatedRoute.params = of({ postId: 1 });
    mockPostService.getPostById.and.returnValue(of(mockPost));

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mijnconcepten']);
  });

  it('should call savePost when onSave is called', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: Post = {
      id: 1,
      title: 'Post Title',
      content: 'Post Content',
      authorId: 1,
      author: 'editor1',
      state: 'CONCEPT',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostById.and.returnValue(of(mockPost));

    component.ngOnInit();
    spyOn(component, 'savePost'); // Spying on savePost instead of onSave
    component.onSave();
    expect(component.savePost).toHaveBeenCalled();
  });

  it('should call savePost with "SUBMITTED" state when onSubmit is called', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: Post = {
      id: 1,
      title: 'Post Title',
      content: 'Post Content',
      authorId: 1,
      author: 'editor1',
      state: 'CONCEPT',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostById.and.returnValue(of(mockPost));
    mockPostService.updatePost.and.returnValue(of(mockPost));

    component.ngOnInit();

    component.onSubmit();

    expect(component.post.state).toBe('SUBMITTED');

    expect(mockPostService.updatePost).toHaveBeenCalledWith(
      mockPost,
      mockUser.username,
      mockUser.id
    );
  });

  it('should handle error and display error message when savePost fails', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPost: Post = {
      id: 1,
      title: 'Post Title',
      content: 'Post Content',
      authorId: 1,
      author: 'editor1',
      state: 'CONCEPT',
      creationDate: new Date(),
      publicationDate: new Date(),
      category: 'ALGEMEEN',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getPostById.and.returnValue(of(mockPost));
    mockPostService.updatePost.and.returnValue(
      throwError(() => new Error('Error saving post'))
    );

    component.ngOnInit();
    component.onSave();

    expect(component.errorMessage).toBe('Error saving post');
  });

  it('should navigate back to /mijnconcepten when onBack is called', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/mijnconcepten']);
  });
});
