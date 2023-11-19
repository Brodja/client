import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Game, IGameMenu } from 'src/app/pages/rooms-page/room.interface';
import { IGame } from '../layouts/secret-hitler-layout/secret-hitler.inerface';

@Injectable({ providedIn: 'root' })
export class GamesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IGameMenu[]> {
    return this.http.get<IGameMenu[]>('/api/games/getAll');
  }

  getMyGame(): Observable<any> {
    return this.http.get<IGame>('/api/games/getMyGame');
  }

  create({ type, roomId }: { type: Game; roomId: string }): Observable<any> {
    return this.http.post<any>('/api/games', { type, roomId });
  }

  stopGame({ gameId }: { gameId: string }): Observable<void> {
    return this.http.post<any>('/api/games/stopGame', { gameId });
  }
}
