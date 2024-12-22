import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApprovingpostsComponent } from './approvingposts.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { ReviewService } from '../../../shared/services/reviewservice/review.service';
import { User } from '../../../shared/models/user.model';
import { Post } from '../../../shared/models/post.model';

describe('ApprovingpostsComponent', () => {
  let component: ApprovingpostsComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockReviewService = jasmine.createSpyObj('ReviewService', [
      'getReviewPosts',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ApprovingpostsComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(ApprovingpostsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to login if user is not authenticated', () => {
      mockAuthService.getCurrentUser.and.returnValue(null);

      mockReviewService.getReviewPosts.and.returnValue(of([]));

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should fetch review posts if user is authenticated', () => {
      const mockUser: User = {
        username: 'editor1',
        id: 1,
        email: 'test@example.com',
        role: 'editor',
        password: 'password',
      };
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      spyOn(component, 'fetchReviewPosts');

      component.ngOnInit();

      expect(component.user).toEqual(mockUser);
      expect(component.fetchReviewPosts).toHaveBeenCalled();
    });
  });

  describe('fetchReviewPosts', () => {
    it('should fetch and filter posts not authored by the current user', () => {
      const mockUser: User = {
        username: 'editor1',
        id: 1,
        email: 'test@example.com',
        role: 'editor',
        password: 'password',
      };
      const mockPosts: Post[] = [
        {
          id: 1,
          title: 'Post 1',
          content: 'Content 1',
          creationDate: new Date('2023-01-01'),
          state: 'REVIEW',
          category: 'GENERAL',
          authorId: 2,
          author: 'editor2',
          publicationDate: null,
        },
        {
          id: 2,
          title: 'Post 2',
          content: 'Content 2',
          creationDate: new Date('2023-01-02'),
          state: 'REVIEW',
          category: 'GENERAL',
          authorId: 1,
          author: 'editor1',
          publicationDate: null,
        },
      ];
      mockAuthService.getCurrentUser.and.returnValue(mockUser);
      mockReviewService.getReviewPosts.and.returnValue(of(mockPosts));

      component.user = mockUser;
      component.fetchReviewPosts();

      expect(component.posts.length).toBe(1);
      expect(component.posts[0].authorId).not.toBe(mockUser.id);
    });

    it('should log an error if fetching posts fails', () => {
      const consoleSpy = spyOn(console, 'error');
      mockReviewService.getReviewPosts.and.returnValue(
        throwError(() => new Error('Network Error'))
      );

      component.fetchReviewPosts();

      expect(consoleSpy).toHaveBeenCalledWith(new Error('Network Error'));
    });
  });
});
