import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { BackUser, User } from 'src/app/shared/interfaces';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RoomsService } from 'src/app/shared/services/rooms.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { BackRoom } from '../room.interface';
import { Observable, Subscription, map, switchMap } from 'rxjs';
import { Peer } from 'peerjs';

@Component({
  selector: 'app-rooms-join',
  templateUrl: './rooms-join.component.html',
  styleUrls: ['./rooms-join.component.css'],
})
export class RoomsJoinComponent implements OnInit, OnDestroy {
  urSub!: Subscription;
  jrSub!: Subscription;
  room!: BackRoom;
  localVideo: any;
  localMediaStream: any;
  peer: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socketService: SocketService,
    private roomsService: RoomsService,
    private router: Router
  ) {}

  ngOnDestroy() {
    if (this.urSub) this.urSub.unsubscribe();
    if (this.jrSub) this.jrSub.unsubscribe();
  }

  async ngOnInit() {
    // 1) Перевірка підключення до кімнати
    this.jrSub = this.activatedRoute.params.subscribe(
      ({ id }) => {
        this.jrSub = this.roomsService.join(id).subscribe(
          (room) => {
            this.room = room;
            setTimeout(async () => await this.initMyVideo(), 1000);
            MaterialService.toast(`Ви війшли в кімнату "${this.room.name}"`);
          },
          (error) => MaterialService.toast(error.error.message)
        );
      },
      (error) => MaterialService.toast(error.error.message)
    );

    // 2) Підписка на зміни кімнати
    this.urSub = this.socketService.updateRoom().subscribe(async (obj) => {
      await this.updateUsers(obj.room, obj.user);
    });
  }

  async updateUsers(room: BackRoom, user: BackUser): Promise<void> {
    if (user.id === this.authService.getUser().id) return;
    // 1) Добавить Юзера
    if (!this.room.users.find((u) => u.id === user.id)) {
      this.room.users.push(user);
    }
    // 2) Удалить Юзера
    else if (!room.users.find((u) => u.id === user.id)) {
      this.room.users.splice(
        this.room.users.findIndex((u) => u.id === user.id),
        1
      );
    }
    // 3) Обновить Юзера
    else {
      const userToUpdate = <BackUser>(
        this.room.users.find((u) => u.id === user.id)
      );
      userToUpdate.peerId = user.peerId;
    }
    for (const user of this.room.users) {
      await this.initOtherVideo(user);
    }
  }

  async initMyVideo(): Promise<void> {
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

    const myId: string = this.authService.getUser().id.toString();

    this.localVideo = this.getVideoByUserId(myId);
    this.localVideo.muted = true;
    this.localVideo.srcObject = this.localMediaStream;

    this.peer = new Peer();
    this.peer.on('open', (id: string) => {
      this.socketService.sendPeerId(id);
    });
    this.peer.on('call', (call: any) => {
      call.answer(this.localMediaStream);
      call.on('stream', (stream: any) => {
        const user = this.room?.users.find((u) => u.peerId === call.peer);
        const video = this.getVideoByUserId(user?.id || '');
        video.srcObject = stream;
        video.onloadeddata = () => video.play();
      });
    });
  }

  async initOtherVideo(user: BackUser): Promise<void> {
    const call = this.peer.call(user.peerId, this.localMediaStream);
    call.on('stream', (stream: any) => {
      const video = this.getVideoByUserId(user?.id || '');
      video.srcObject = stream;
      video.onloadeddata = () => video.play();
    });
  }

  getVideoByUserId(id: string): any {
    const element = document.getElementById(id);
    return element?.children[0].children[0];
  }

  leaveRoom() {
    this.roomsService
      .leave(this.activatedRoute.snapshot.params['id'])
      .subscribe(
        () => {
          this.router.navigate([`/rooms`]);
          MaterialService.toast(`Ви покинули в кімнату "${this.room?.name}"`);
        },
        (error) => MaterialService.toast(error.error.message)
      );
  }
}
