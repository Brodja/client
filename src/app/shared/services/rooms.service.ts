import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Message } from '../interfaces';
import { ClientRoom, BackRoom } from 'src/app/rooms-page/room.interface';

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

  connect(config: any): Observable<BackRoom> {
    return this.http.post<BackRoom>(`/api/rooms/connect`, config);
  }
}
