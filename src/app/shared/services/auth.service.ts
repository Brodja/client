import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BackUser, User } from '../interfaces';
import { MaterialService } from '../classes/material.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  private user: BackUser | null = null;
  constructor(private http: HttpClient, private router: Router) {}

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(user: User): Observable<{ token: string; user: BackUser }> {
    return this.http
      .post<{ token: string; user: BackUser }>('/api/auth/login', user)
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
          this.setUser(user);
        })
      );
  }

  initUser(): Observable<BackUser> {
    return this.http.get<BackUser>('/api/auth/profile');
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  setUser(user: BackUser): void {
    this.user = user;
  }

  getUser(): BackUser {
    if (this.user?.currentGame) {
      if (this.router.url !== this.user?.currentGame?.type) {
        this.router.navigate([`../${this.user?.currentGame?.type}`]);
      }
    }
    return <BackUser>this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = '';
    localStorage.clear();
  }
}
