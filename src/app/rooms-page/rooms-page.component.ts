import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsService } from '../shared/services/rooms.service';
import { BackRoom } from './room.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.css'],
})
export class RoomsPageComponent implements OnInit {
  roomList$: Observable<BackRoom[]> | undefined;
  form!: FormGroup;

  constructor(private rooms: RoomsService, private router: Router) {}

  ngOnInit(): void {
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
      this.router.navigate([`/rooms/${room.id}`]);
    } else {
      this.form.enable();
      MaterialService.toast('Невірний пароль від кімнати');
    }
  }
}
