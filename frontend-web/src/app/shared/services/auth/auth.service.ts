import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [
    {
      username: 'user1',
      role: 'user',
      id: 1,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
    {
      username: 'editor1',
      role: 'editor',
      id: 2,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
    {
      username: 'user2',
      role: 'user',
      id: 3,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
    {
      username: 'user3',
      role: 'user',
      id: 4,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
    {
      username: 'editor2',
      role: 'editor',
      id: 5,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
    {
      username: 'user4',
      role: 'user',
      id: 6,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
    {
      username: 'editor3',
      role: 'editor',
      id: 7,
      password: 'password',
      email: 'roneerdekenspxl@gmail.com',
    },
  ];

  private currentUser: User | null = null; // Standaard de eerste gebruiker

  getUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    } else {
      const userData = localStorage.getItem('currentUser');
      const storedUser = userData ? (JSON.parse(userData) as User) : null;

      if (storedUser) {
        return storedUser;
      }
      return null;
    }
  }

  setCurrentUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      if (user.password !== password) {
        throw new Error('Wachtwoord is ongeldig');
      } else {
        this.currentUser = user;
        this.currentUser.password = '';
        this.saveCurrentUser();
      }
    } else {
      throw new Error('Gebruikersnaam bestaat niet');
    }
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }
  private saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }
}
