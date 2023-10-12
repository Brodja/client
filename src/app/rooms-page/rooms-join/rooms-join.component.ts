import { Component } from '@angular/core';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-rooms-join',
  templateUrl: './rooms-join.component.html',
  styleUrls: ['./rooms-join.component.css'],
})
export class RoomsJoinComponent {
  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.sendTest();
  }
}
