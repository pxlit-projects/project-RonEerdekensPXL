import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AddPostComponent } from './add-post.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { PostService } from '../../../shared/services/postservice/post.service';
import { User } from '../../../shared/models/user.model';
import { PostAdd } from '../../../shared/models/postAdd.model';
import { CanDeactivateFn } from '@angular/router';
import { canDeactivateAddPostGuard } from '../../../shared/guards/can-deactivate-add-post.guard';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let executeGuard: CanDeactivateFn<any>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    mockPostService = jasmine.createSpyObj('PostService', ['addNewPost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    executeGuard = (component, currentRoute, currentState, nextState) =>
      TestBed.runInInjectionContext(() =>
        canDeactivateAddPostGuard(
          component,
          currentRoute,
          currentState,
          nextState
        )
      );

    TestBed.configureTestingModule({
      imports: [AddPostComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(AddPostComponent);
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

    it('should redirect to /nieuws if user is not an editor', () => {
      mockAuthService.getCurrentUser.and.returnValue({
        role: 'user',
      } as User);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/nieuws']);
    });

    it('should set the user if authenticated and role is editor', () => {
      const mockUser: User = {
        username: 'editor1',
        id: 1,
        email: 'test@example.com',
        role: 'editor',
        password: 'password',
      };
      mockAuthService.getCurrentUser.and.returnValue(mockUser);

      component.ngOnInit();

      expect(component.user).toEqual(mockUser);
    });
  });

  describe('onAddPost', () => {
    it('should call PostService.addNewPost and navigate on success', () => {
      const mockUser: User = {
        username: 'editor1',
        id: 1,
        email: 'test@example.com',
        role: 'editor',
        password: 'password',
      };
      component.user = mockUser;
      component.titleField = 'Test Title';
      component.contentField = 'Test Content';
      component.statusField = 'CONCEPT';
      component.categoryField = 'ALGEMEEN';

      const mockPost: PostAdd = {
        title: 'Test Title',
        content: 'Test Content',
        state: 'CONCEPT',
        category: 'ALGEMEEN',
      };

      mockPostService.addNewPost.and.returnValue(
        of({
          id: 1,
          title: 'Test Title',
          content: 'Test Content',
          creationDate: new Date(),
          state: 'CONCEPT',
          category: 'ALGEMEEN',
          authorId: 1,
          author: 'editor1',
          publicationDate: new Date(),
        })
      );

      component.onAddPost({});

      expect(mockPostService.addNewPost).toHaveBeenCalledWith(
        mockPost,
        mockUser.username,
        mockUser.id,
        mockUser.email
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/mijnconcepten']);
    });

    it('should set an error message on failure', () => {
      const mockUser: User = {
        username: 'editor1',
        id: 1,
        email: 'test@example.com',
        role: 'editor',
        password: 'password',
      };
      component.user = mockUser;
      component.titleField = 'Test Title';
      component.contentField = 'Test Content';
      component.statusField = 'CONCEPT';
      component.categoryField = 'ALGEMEEN';

      mockPostService.addNewPost.and.returnValue(
        throwError(() => new Error('Network Error'))
      );

      component.onAddPost({});

      expect(component.errorMessage).toBe('Network Error');
    });
  });
});
