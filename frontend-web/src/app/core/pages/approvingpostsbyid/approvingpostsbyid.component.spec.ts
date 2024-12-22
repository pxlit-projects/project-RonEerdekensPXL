import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApprovingpostsbyidComponent } from './approvingpostsbyid.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { ReviewService } from '../../../shared/services/reviewservice/review.service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ApprovingpostsbyidComponent', () => {
  let component: ApprovingpostsbyidComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', ['getPostById']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['approvePost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ postId: 1 }),
    });
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      imports: [ApprovingpostsbyidComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatDialog, useValue: mockDialog },
      ],
    });

    const fixture = TestBed.createComponent(ApprovingpostsbyidComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to login if user is not authenticated', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should fetch the post by ID if user is authenticated', () => {
      const mockUser: User = {
        username: 'editor',
        id: 1,
        email: 'test@test.com',
        role: 'editor',
        password: '',
      };
      const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Content',
        creationDate: new Date(),
        state: 'PENDING',
        category: 'TEST',
        authorId: 1,
        author: 'editor',
        publicationDate: new Date(),
      };

      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockPostService.getPostById.and.returnValue(of(mockPost));

      component.ngOnInit();

      expect(component.user).toEqual(mockUser);
      expect(component.post).toEqual(mockPost);
    });

    it('should set an error message if fetching post by ID fails', () => {
      const mockUser: User = {
        username: 'editor',
        id: 1,
        email: 'test@test.com',
        role: 'editor',
        password: '',
      };

      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockPostService.getPostById.and.returnValue(
        throwError(() => new Error('Network Error'))
      );

      component.ngOnInit();

      expect(component.errorMessage).toBe('Network Error');
    });
  });

  describe('openDialog', () => {
    it('should open the reject post dialog', () => {
      const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Content',
        creationDate: new Date(),
        state: 'PENDING',
        category: 'TEST',
        authorId: 1,
        author: 'editor',
        publicationDate: new Date(),
      };

      component.post = mockPost;

      component.openDialog();

      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.any(Function), {
        data: { postId: 1 },
      });
    });
  });

  describe('onApprove', () => {
    it('should approve the post and navigate back after success', fakeAsync(() => {
      const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Content',
        creationDate: new Date(),
        state: 'SUBMITTED',
        category: 'TEST',
        authorId: 1,
        author: 'editor',
        publicationDate: new Date(),
      };

      component.post = mockPost;
      mockReviewService.approvePost.and.returnValue(of(mockPost));

      component.onApprove();

      // Simulate the passage of 1000ms
      tick(1000);

      expect(mockReviewService.approvePost).toHaveBeenCalledWith(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/berichtengoedkeuren',
      ]);
    }));
  });

  describe('onBack', () => {
    it('should navigate back to /berichtengoedkeuren', () => {
      component.onBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/berichtengoedkeuren',
      ]);
    });
  });
});
