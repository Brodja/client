import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<{ name: string; id: number }[]> {
    return this.http.get<{ name: string; id: number }[]>('/api/games/getAll');
  }

  create({ name, roomId }: { name: string; roomId: string }): Observable<any> {
    return this.http.post<any>('/api/games', { name, roomId });
  }
}
