import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Message, Room } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>('/api/rooms/getAll');
  }

  getById(id: string): Observable<Room> {
    return this.http.get<Room>(`/api/rooms/${id}`);
  }

  create(name: string): Observable<Room> {
    return this.http.post<Room>('/api/rooms', {name});
  }

  update(id: string, name: string): Observable<Room> {
    return this.http.patch<Room>(`/api/rooms/${id}`, {name});
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/rooms/${id}`);
  }
}
