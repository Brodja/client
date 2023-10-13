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
    this.socket = io.connect('http://localhost:3000', { auth: { token } });
  }

  updateRoomsList(): Observable<BackRoom[]> {
    return new Observable((subscribe) => {
      this.socket.on('updateRoomsList', (rooms) => {
        subscribe.next(rooms);
      });
    });
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
