import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RejectPostDialogComponent } from './reject-post-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { ReviewService } from '../../../../shared/services/reviewservice/review.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { RemarkAdd } from '../../../../shared/models/remarkAdd.model';

describe('RejectPostDialogComponent', () => {
  let component: RejectPostDialogComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<RejectPostDialogComponent>>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['rejectPost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [RejectPostDialogComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { postId: 123 } },
      ],
    });

    const fixture = TestBed.createComponent(RejectPostDialogComponent);
    component = fixture.componentInstance;
  });

  it('should initialize correctly and set the postId', () => {
    expect(component.postId).toBe(123);
  });

  it('should navigate to /login if the user is not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set the user if logged in', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'user',
      email: 'testuser@example.com',
      password: 'password123',
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();
    expect(component.user).toEqual(mockUser);
  });

  it('should handle rejection successfully', fakeAsync(() => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'editor',
      email: 'testuser@example.com',
      password: 'password123',
    };
    const remark: RemarkAdd = {
      content: 'Inappropriate content',
      postId: 123,
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockReviewService.rejectPost.and.returnValue(of({ success: true }));
    component.comment = 'Inappropriate content';
    component.ngOnInit();
    component.onReject();

    expect(mockReviewService.rejectPost).toHaveBeenCalledWith(
      remark,
      mockUser.username,
      mockUser.id
    );

    // Simulate the passage of 1000ms
    tick(1000);

    expect(mockDialogRef.close).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/berichtengoedkeuren']);
  }));

  it('should handle errors during rejection', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'editor',
      email: 'testuser@example.com',
      password: 'password123',
    };

    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockReviewService.rejectPost.and.returnValue(
      throwError(() => new Error('Rejection failed'))
    );
    component.comment = 'Inappropriate content';
    component.ngOnInit();
    component.onReject();

    expect(mockReviewService.rejectPost).toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
