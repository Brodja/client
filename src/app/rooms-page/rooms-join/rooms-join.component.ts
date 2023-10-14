import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { BackUser, User } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RoomsService } from 'src/app/shared/services/rooms.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { BackRoom } from '../room.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rooms-join',
  templateUrl: './rooms-join.component.html',
  styleUrls: ['./rooms-join.component.css'],
})
export class RoomsJoinComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoPlayer')
  videoplayer!: ElementRef;

  pSub!: Subscription;
  rSub!: Subscription;
  urSub!: Subscription;
  jrSub!: Subscription;
  users: BackUser[] | null = [];
  room: BackRoom | null = null;
  localMediaStream: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private roomsService: RoomsService,
    private router: Router
  ) {}

  ngOnDestroy() {
    if (this.pSub) this.pSub.unsubscribe();
    if (this.rSub) this.rSub.unsubscribe();
    if (this.urSub) this.urSub.unsubscribe();
    if (this.jrSub) this.jrSub.unsubscribe();
  }

  async ngOnInit() {
    // 1) Перевірка підключення до кімнати
    this.jrSub = this.activatedRoute.params.subscribe(
      ({ id }) => {
        this.rSub = this.roomsService.join(id).subscribe(
          (room) => {},
          (error) => {
            MaterialService.toast(error.error.message);
          }
        );
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );
    // 2) Отримання кімнати
    this.pSub = this.activatedRoute.params.subscribe(
      ({ id }) => {
        this.rSub = this.roomsService.getById(id).subscribe(
          (room) => {
            this.room = room;
            MaterialService.toast(`Ви війшли в кімнату "${this.room.name}"`);
          },
          (error) => {
            MaterialService.toast(error.error.message);
          }
        );
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );
    // 3) Підписка на зміни кімнати
    this.urSub = this.socketService.updateRoom().subscribe((room) => {
      this.room = room;
    });

    // this.recordAudio = () => {
    //   return new Promise((resolve) => {
    //     navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    //       console.log(stream);
    //     })
    //   })
    // }

    this.localMediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: {
          min: 320,
          ideal: 640,
          max: 1024,
        },
        height: {
          min: 240,
          ideal: 480,
          max: 600,
        },
      },
      audio: true,
    });
    console.log('this.localMediaStream', this.localMediaStream);
    this.videoplayer.nativeElement.muted = true;
    this.videoplayer.nativeElement.srcObject = this.localMediaStream;
    // localVideoElement?.muted = true;
    // localVideoElement.srcObject = localMediaStream;
    // this.videoplayer.nativeElement.onloadeddata = () => this.videoplayer.nativeElement.play();
    // this.videoplayer.nativeElement.play();
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
}

  ngAfterViewInit() {}

  leaveRoom() {
    this.roomsService
      .leave(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        () => {
          this.router.navigate([`/rooms`]);
          MaterialService.toast(`Ви покинули в кімнату "${this.room?.name}"`);
        },
        (error) => {
          MaterialService.toast(error.error.message);
        }
      );
  }
}
