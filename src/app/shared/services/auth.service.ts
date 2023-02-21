import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;
  constructor(private http: HttpClient) {}

  register() {}

  login(user: User): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>('/api/auth/login', user)
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        })
      );
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = null;
    localStorage.clear();
  }
}
