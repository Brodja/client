import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackUser } from '../interfaces';
import { BackRoom, RoomUserEvent } from 'src/app/rooms-page/room.interface';
import { Router } from '@angular/router';
import { MaterialService } from '../classes/material.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor(private authService: AuthService, private router: Router) {
    const token = authService.getToken();
    this.socket = io.connect('https://localhost:3000', { auth: { token } });
    this.socket.on('disconnectUser', () => {
      MaterialService.toast(
        'Ви підключились з іншого вікна - Вас відключено!!!'
      );
      this.socket.close();
      this.router.navigate(['/login']);
      this.authService.logout();
    });
  }

  setUser(): Observable<BackUser> {
    return new Observable((subscribe) => {
      this.socket.on('setUser', (user) => {
        subscribe.next(user);
      });
    });
  }

  // Зміни списку кімнат
  updateRoomsList(): Observable<BackRoom[]> {
    return new Observable((subscribe) => {
      this.socket.on('updateRoomsList', (rooms) => {
        subscribe.next(rooms);
      });
    });
  }

  // Зміна юзерів кімнати
  updateUserInRoom(): Observable<{
    room: BackRoom;
    user: BackUser;
    event: RoomUserEvent;
  }> {
    return new Observable((subscribe) => {
      this.socket.on('updateUserInRoom', (obj) => {
        subscribe.next(obj);
      });
    });
  }

  sendPeerId(id: string): void {
    this.socket.emit('sendPeerId', { id });
  }
}
