import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);
  private users: { [email: string]: { password: string; user: User } } = {};
  private nextUserId = 1;
  private isBrowser: boolean;

  currentUser$ = this.currentUser.asObservable();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFromLocalStorage();
  }

  signup(email: string, name: string, password: string): AuthResponse {
    if (!email || !name || !password) {
      return { success: false, message: 'All fields are required' };
    }

    if (this.users[email]) {
      return { success: false, message: 'Email already registered' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    const user: User = {
      id: this.nextUserId++,
      email,
      name
    };

    this.users[email] = { password, user };
    this.saveToLocalStorage();

    return { success: true, message: 'Signup successful! Please login.', user };
  }

  login(email: string, password: string): AuthResponse {
    if (!email || !password) {
      return { success: false, message: 'Email and password are required' };
    }

    const userRecord = this.users[email];

    if (!userRecord) {
      return { success: false, message: 'Email not found. Please signup first.' };
    }

    if (userRecord.password !== password) {
      return { success: false, message: 'Invalid password' };
    }

    this.currentUser.next(userRecord.user);
    this.saveToLocalStorage();

    return { success: true, message: 'Login successful', user: userRecord.user };
  }

  logout(): void {
    this.currentUser.next(null);
    this.saveToLocalStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  private saveToLocalStorage(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser.value));
      localStorage.setItem('nextUserId', this.nextUserId.toString());
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;
    try {
      const saved = localStorage.getItem('users');
      if (saved) {
        this.users = JSON.parse(saved);
      }

      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        this.currentUser.next(JSON.parse(currentUser));
      }

      const nextId = localStorage.getItem('nextUserId');
      if (nextId) {
        this.nextUserId = parseInt(nextId);
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  }
}
