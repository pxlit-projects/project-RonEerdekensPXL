import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [
    { username: 'user1', role: 'user', id: 1, password: 'password' },
    { username: 'editor1', role: 'editor', id: 2, password: 'password' },
    { username: 'viewer', role: 'viewer', id: 3, password: 'password' },
  ];

  private currentUser: User = this.users[0]; // Standaard de eerste gebruiker

  getUsers(): User[] {
    return this.users;
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUser(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (user) {
      if (user.password !== password) {
        throw new Error('Wachtwoord is ongeldig');
      } else {
        this.currentUser = user;
      }
    } else {
      throw new Error('Gebruikersnaam bestaat niet');
    }
  }
}
