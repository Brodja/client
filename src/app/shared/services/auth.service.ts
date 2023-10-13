import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BackUser, User } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string = '';
  private user: BackUser | null = null;
  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user);
  }

  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string, user: BackUser }>('/api/auth/login', user).pipe(
      tap(({ token, user }) => {
        localStorage.setItem('auth-token', token);
        this.setToken(token);
        this.setUser(user);
      })
    );
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
