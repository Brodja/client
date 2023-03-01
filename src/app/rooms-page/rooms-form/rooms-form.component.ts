import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { RoomsService } from 'src/app/shared/services/rooms.service';

@Component({
  selector: 'app-rooms-form',
  templateUrl: './rooms-form.component.html',
  styleUrls: ['./rooms-form.component.css'],
})
export class RoomsFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;
  room: any;

  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.roomsService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        (room) => {
          if (room) {
            this.room = room;
            this.form.patchValue({
              name: room.name,
            });
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }

  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      obs$ = this.roomsService.create(this.form.value.name);
    } else {
      obs$ = this.roomsService.update(this.room.id, this.form.value.name);
    }

    obs$.subscribe(
      room => {
        this.room = room;
        MaterialService.toast('All saved')
        this.form.enable();
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable();
      }
    )
  }

  deleteRoom() {
    const decision = window.confirm(`Remove room - "${this.room.name}"`);
    if (decision) {
      this.roomsService.delete(this.room.id)
      .subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/rooms'])
      )
    }
  }
}
