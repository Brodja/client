import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { BackUser, User } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RoomsService } from 'src/app/shared/services/rooms.service';
import { SocketService } from 'src/app/shared/services/socket.service';

@Component({
  selector: 'app-rooms-join',
  templateUrl: './rooms-join.component.html',
  styleUrls: ['./rooms-join.component.css'],
})
export class RoomsJoinComponent {
  users: BackUser[] | null = [];
  roomId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private roomsService: RoomsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.roomId = this.activatedRoute.snapshot.params['id'];
    this.roomsService
      .join(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        () => {
          MaterialService.toast('Ви війшли в кімнату');
        },
        (error) => {
          MaterialService.toast(error.error.message);
        }
      );
  
    }

    leaveRoom() {
      this.roomsService
      .leave(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        () => {
          this.router.navigate([`/rooms`])
          MaterialService.toast('Ви покинули кімнату');
        },
        (error) => {
          MaterialService.toast(error.error.message);
        }
      );
    }

}
