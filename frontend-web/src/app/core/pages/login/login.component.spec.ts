import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { User } from '../../../shared/models/user.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'setCurrentUser',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to /nieuws if the user is already logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue({
      id: 1,
      username: 'testUser',
    } as User);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/nieuws']);
  });

  it('should not redirect if the user is not logged in', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should log in the user and navigate to /nieuws on successful login', () => {
    component.usernameField = 'testUser';
    component.passwordField = 'password123';
    mockAuthService.setCurrentUser.and.stub();

    component.onLogin({});

    expect(mockAuthService.setCurrentUser).toHaveBeenCalledWith(
      'testUser',
      'password123'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/nieuws']);
  });

  it('should display an error message on login failure', () => {
    component.usernameField = 'wrongUser';
    component.passwordField = 'wrongPassword';
    mockAuthService.setCurrentUser.and.throwError('Invalid credentials');

    component.onLogin({});

    expect(mockAuthService.setCurrentUser).toHaveBeenCalledWith(
      'wrongUser',
      'wrongPassword'
    );
    expect(component.errorMessage).toBe('Invalid credentials');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
