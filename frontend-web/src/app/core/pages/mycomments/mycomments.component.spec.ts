import { TestBed } from '@angular/core/testing';
import { MycommentsComponent } from './mycomments.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { CommentService } from '../../../shared/services/commentservice/comment.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Comment } from '../../../shared/models/comment.model';
import { User } from '../../../shared/models/user.model';

describe('MycommentsComponent', () => {
  let component: MycommentsComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockCommentService = jasmine.createSpyObj('CommentService', [
      'getCommentsOfUser',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [MycommentsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CommentService, useValue: mockCommentService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(MycommentsComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to /login if the user is not authenticated', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch and sort comments if the user is authenticated', () => {
    const mockUser: User = {
      id: 1,
      username: 'user1',
      role: 'user',
      password: 'password',
      email: 'testUser@example.com',
    };
    const mockComments: Comment[] = [
      {
        id: 1,
        comment: 'Old Comment',
        creationDate: new Date('2024-12-20'),
        postId: 1,
        authorId: 1,
        author: 'user1',
      },
      {
        id: 2,
        comment: 'New Comment',
        creationDate: new Date('2024-12-21'),
        postId: 1,
        authorId: 1,
        author: 'user1',
      },
    ];
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockCommentService.getCommentsOfUser.and.returnValue(of(mockComments));
    component.ngOnInit();

    expect(mockCommentService.getCommentsOfUser).toHaveBeenCalledWith(
      'user1',
      1
    );
    expect(component.comments).toEqual([
      {
        id: 2,
        comment: 'New Comment',
        creationDate: new Date('2024-12-21'),
        postId: 1,
        authorId: 1,
        author: 'user1',
      },
      {
        id: 1,
        comment: 'Old Comment',
        creationDate: new Date('2024-12-20'),
        postId: 1,
        authorId: 1,
        author: 'user1',
      },
    ]);
  });

  it('should handle errors when fetching comments', () => {
    const mockUser: User = {
      id: 1,
      username: 'user1',
      role: 'user',
      password: 'password',
      email: 'testUser@example.com',
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockCommentService.getCommentsOfUser.and.returnValue(
      throwError(() => new Error('Error fetching comments'))
    );

    spyOn(console, 'error');

    component.ngOnInit();

    expect(mockCommentService.getCommentsOfUser).toHaveBeenCalledWith(
      'user1',
      1
    );
    expect(console.error).toHaveBeenCalledWith(
      new Error('Error fetching comments')
    );
    expect(component.comments).toBeUndefined();
  });

  it('should not navigate if the user is authenticated', () => {
    const mockUser: User = {
      id: 1,
      username: 'user1',
      role: 'user',
      password: 'password',
      email: 'testUser@example.com',
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    mockCommentService.getCommentsOfUser.and.returnValue(of([]));

    component.ngOnInit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
