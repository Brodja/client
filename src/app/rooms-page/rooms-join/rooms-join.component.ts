import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private roomsService: RoomsService
  ) {}

  ngOnInit(): void {
    console.log('INIT', this.activatedRoute.snapshot.params['id']);
    this.roomsService.connect(this.activatedRoute.snapshot.params['id']).subscribe(
      () => {
        MaterialService.toast('Ви війшли в кімнату');
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );
  }
}
