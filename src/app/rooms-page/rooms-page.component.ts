import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsService } from '../shared/services/rooms.service';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.css'],
})
export class RoomsPageComponent implements OnInit{
  roomList$: Observable<any[]> | undefined;

  constructor(private rooms: RoomsService) {}


  ngOnInit(): void {
    this.roomList$ = this.rooms.getAll();
  }

}
