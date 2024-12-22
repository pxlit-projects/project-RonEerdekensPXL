import { TestBed } from '@angular/core/testing';
import { MyconceptsComponent } from './myconcepts.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Post } from '../../../shared/models/post.model';
import { User } from '../../../shared/models/user.model';

describe('MyconceptsComponent', () => {
  let component: MyconceptsComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', ['getConceptPosts']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [MyconceptsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(MyconceptsComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to /login if the user is not authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch concept posts when user is authenticated', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Post Title 1',
        content: 'Post Content 1',
        authorId: 1,
        author: 'editor1',
        state: 'CONCEPT',
        creationDate: new Date('2024-01-01'),
        publicationDate: new Date(),
        category: 'ALGEMEEN',
      },
      {
        id: 2,
        title: 'Post Title 2',
        content: 'Post Content 2',
        authorId: 1,
        author: 'editor1',
        state: 'CONCEPT',
        creationDate: new Date('2024-02-01'),
        publicationDate: new Date(),
        category: 'ALGEMEEN',
      },
    ];

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getConceptPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(mockPostService.getConceptPosts).toHaveBeenCalledWith(
      mockUser.id,
      mockUser.username
    );
    expect(component.posts).toEqual(mockPosts);
    expect(component.posts[0].title).toBe('Post Title 2');
  });

  it('should handle error if fetching concept posts fails', () => {
    const mockUser: User = {
      id: 1,
      username: 'editor1',
      role: 'editor',
      password: 'password',
      email: 'testUser@example.com',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockPostService.getConceptPosts.and.returnValue(
      throwError(() => new Error('Error fetching posts'))
    );

    console.error = jasmine.createSpy('error');
    component.ngOnInit();

    // Check that the error message is logged correctly
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
    expect(
      (console.error as jasmine.Spy).calls.mostRecent().args[0].message
    ).toBe('Error fetching posts');
  });

  it('should navigate to /berichtaanmaken when onAddPost is called', () => {
    component.onAddPost();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/berichtaanmaken']);
  });
});
