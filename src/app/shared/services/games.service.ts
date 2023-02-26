import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<string[]> {
    return this.http.get<string[]>('/api/games/getAll');
  }
}
