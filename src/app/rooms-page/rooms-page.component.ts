import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoomsService } from '../shared/services/rooms.service';
import { BackRoom } from './room.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from '../shared/classes/material.service';
import { BackUser } from '../shared/interfaces';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.css'],
})
export class RoomsPageComponent implements OnInit, OnDestroy {
  roomList: BackRoom[] | undefined;
  form!: FormGroup;
  user: BackUser | undefined;
  rSub!: Subscription;
  urSub!: Subscription;

  constructor(
    private rooms: RoomsService,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnDestroy() {
    if (this.rSub) this.rSub.unsubscribe();
    if (this.urSub) this.urSub.unsubscribe();
  }

  ngOnInit(): void {
    this.rSub = this.rooms.getAll().subscribe(
      (rooms: BackRoom[]) => {
        this.roomList = rooms;
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );

    this.urSub = this.socketService.updateRoomsList().subscribe((rooms) => {
      this.roomList = rooms;
    });

    this.form = new FormGroup({
      password: new FormControl(null, [Validators.minLength(4)]),
    });
  }

  onSubmit(room: BackRoom) {
    this.form.disable();
    const password: string = this.form.value.password;
    if (!room.password || room.password === password) {
      this.form.enable();
      this.router.navigate([`/rooms/${room.id}`], {
        state: { roomId: room.id },
      });
    } else {
      this.form.enable();
      MaterialService.toast('Невірний пароль від кімнати');
    }
  }
}
