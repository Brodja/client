import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BackUser, Message } from '../interfaces';
import { ClientRoom, BackRoom } from 'src/app/pages/rooms-page/room.interface';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  constructor(private http: HttpClient) {}

  create(newRoom: ClientRoom): Observable<BackRoom> {
    return this.http.post<BackRoom>('/api/rooms', newRoom);
  }

  getAll(): Observable<BackRoom[]> {
    return this.http.get<BackRoom[]>('/api/rooms/getAll');
  }

  getById(id: string): Observable<BackRoom> {
    return this.http.get<BackRoom>(`/api/rooms/${id}`);
  }

  join(roomId: string): Observable<{ room: BackRoom; user: BackUser }> {
    return this.http.post<{ room: BackRoom; user: BackUser }>(
      `/api/rooms/join`,
      { roomId }
    );
  }

  connect(roomId: string): Observable<void> {
    return this.http.post<void>(`/api/rooms/connect`, { roomId });
  }

  leave(roomId: string): Observable<void> {
    return this.http.post<void>(`/api/rooms/leave`, { roomId });
  }

  getOtherUsers(roomId: string): Observable<BackUser[]> {
    return this.http.post<BackUser[]>(`/api/rooms/getOtherUsers`, { roomId });
  }
}
