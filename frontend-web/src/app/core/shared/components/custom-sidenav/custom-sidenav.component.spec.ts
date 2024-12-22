import { TestBed } from '@angular/core/testing';
import { CustomSidenavComponent } from './custom-sidenav.component';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';

describe('CustomSidenavComponent', () => {
  let component: CustomSidenavComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let routerEvents$: ReplaySubject<any>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'logout',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    routerEvents$ = new ReplaySubject(1);
    Object.defineProperty(mockRouter, 'events', {
      get: () => routerEvents$.asObservable(),
    });

    TestBed.configureTestingModule({
      imports: [
        CustomSidenavComponent,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        RouterModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    });

    const fixture = TestBed.createComponent(CustomSidenavComponent);
    component = fixture.componentInstance;
  });

  it('should update user when router events are triggered', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      role: 'user',
      email: 'testuser@example.com',
      password: 'password',
    };
    mockAuthService.getCurrentUser.and.returnValue(mockUser);

    routerEvents$.next('navigationEnd'); // Simulate a router event
    expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });

  it('should navigate to login when logout is called', () => {
    component.logout();

    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login when login is called', () => {
    component.login();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle collapsed input correctly', () => {
    component.collapsed = true;

    expect(component.sidNavCollapsed()).toBeTrue();
  });
});
