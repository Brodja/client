import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  constructor(private authService: AuthService) {
    const token = authService.getToken();
    this.socket = io.connect('http://localhost:3000', { auth: { token } });
  }

  // emit event
  fetchMovies() {
    this.socket.emit('fetchMovies');
  }

  sendTest() {
    this.socket.emit('msgToServer');
  }
}
