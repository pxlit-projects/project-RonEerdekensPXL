import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { User } from '../../models/user.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should retrieve all users', () => {
    const users = service.getUsers();
    expect(users.length).toBe(7);
    expect(users[0].username).toBe('user1');
  });

  it('should retrieve current user from memory if set', () => {
    const mockUser: User = {
      username: 'user1',
      role: 'user',
      id: 1,
      password: '',
      email: 'roneerdekenspxl@gmail.com',
    };
    service.setCurrentUser('user1', 'password');
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should retrieve current user from localStorage if available', () => {
    const mockUser: User = {
      username: 'user1',
      role: 'user',
      id: 1,
      password: '',
      email: 'roneerdekenspxl@gmail.com',
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should return null if no current user is set or stored', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should set the current user if username and password are correct', () => {
    service.setCurrentUser('user1', 'password');
    const currentUser = service.getCurrentUser();
    expect(currentUser).toBeTruthy();
    expect(currentUser?.username).toBe('user1');
  });

  it('should throw an error for invalid password', () => {
    expect(() => service.setCurrentUser('user1', 'wrongpassword')).toThrowError(
      'Wachtwoord is ongeldig'
    );
  });

  it('should throw an error for invalid username', () => {
    expect(() =>
      service.setCurrentUser('nonexistent', 'password')
    ).toThrowError('Gebruikersnaam bestaat niet');
  });

  it('should log out the current user', () => {
    service.setCurrentUser('user1', 'password');
    expect(service.getCurrentUser()).toBeTruthy();
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should save the current user to localStorage', () => {
    service.setCurrentUser('user1', 'password');
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    expect(storedUser.username).toBe('user1');
  });
});
