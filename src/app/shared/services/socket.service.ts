import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackUser } from '../interfaces';
import { BackRoom } from 'src/app/rooms-page/room.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private authService: AuthService) {
    const token = authService.getToken();
    this.socket = io.connect('https://localhost:3000', { auth: { token } });
  }
  // Зміни списку кімнат
  updateRoomsList(): Observable<BackRoom[]> {
    return new Observable((subscribe) => {
      this.socket.on('updateRoomsList', (rooms) => {
        subscribe.next(rooms);
      });
    });
  }
  // Зміна кімнати
  updateRoom(): Observable<{ room: BackRoom; user: BackUser }> {
    return new Observable((subscribe) => {
      this.socket.on('updateRoom', (obj) => {
        subscribe.next(obj);
      });
    });
  }

  sendPeerId(id: string): void {
    this.socket.emit('sendPeerId', { id });
  }

  onGetUser(): Observable<BackUser> {
    return new Observable((observer) => {
      this.socket.on('sendUser', (user) => {
        observer.next(user);
      });
    });
  }

  getUser(): void {
    this.socket.emit('getUser');
  }
}
