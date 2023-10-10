import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  // emit event
  fetchMovies() {
    this.socket.emit('fetchMovies');
  }

  // listen event
  onFetchMovies() {
    return this.socket.fromEvent('fetchMovies');
  }

  sendTest() {
    this.socket.emit('msgToServer');
    this.socket.emit('test2');
  }

  onSendTest() {
    return this.socket.fromEvent('msgToClient');
  }
}
