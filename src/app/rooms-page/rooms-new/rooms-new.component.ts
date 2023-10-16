import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { RoomsService } from 'src/app/shared/services/rooms.service';
import { BackRoom, ClientRoom } from '../room.interface';

@Component({
  selector: 'app-rooms-new',
  templateUrl: './rooms-new.component.html',
  styleUrls: ['./rooms-new.component.css'],
})
export class RoomsNewComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  room: BackRoom | undefined;
  aSub!: Subscription;

  constructor(private roomsService: RoomsService, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.minLength(4)]),
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) this.aSub.unsubscribe();
  }

  onSubmit() {
    let aSub$;
    this.form.disable();
    const newRoom: ClientRoom = this.form.value;
    aSub$ = this.roomsService.create(newRoom).subscribe(
      (room: BackRoom) => {
        this.room = room;
        MaterialService.toast('Кімната створена');
        this.form.enable();
        this.router.navigate([`/rooms/${room.id}`]);
      },
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
}
