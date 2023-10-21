import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Game, IGameMenu } from 'src/app/pages/rooms-page/room.interface';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IGameMenu[]> {
    return this.http.get<IGameMenu[]>('/api/games/getAll');
  }

  create({ type, roomId }: { type: Game; roomId: string }): Observable<any> {
    return this.http.post<any>('/api/games', { type, roomId });
  }
}
