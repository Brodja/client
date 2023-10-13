import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsService } from '../shared/services/rooms.service';
import { BackRoom } from './room.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from '../shared/classes/material.service';
import { AuthService } from '../shared/services/auth.service';
import { BackUser } from '../shared/interfaces';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.css'],
})
export class RoomsPageComponent implements OnInit {
  roomList$: Observable<BackRoom[]> | undefined;
  form!: FormGroup;
  user: BackUser | undefined;

  constructor(
    private rooms: RoomsService,
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService,
  ) {
    // this.user = this.authService.getUser();
  }

  ngOnInit(): void {
    this.authService.initUser().subscribe(
      (user) => {
        this.user = user;
        this.authService.setUser(user);
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );
    this.roomList$ = this.rooms.getAll();

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
