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
import { BackRoom, RoomUserEvent } from '../room.interface';
import { Observable, Subscription, map, switchMap } from 'rxjs';
import { Peer } from 'peerjs';

@Component({
  selector: 'app-rooms-join',
  templateUrl: './rooms-join.component.html',
  styleUrls: ['./rooms-join.component.css'],
})
export class RoomsJoinComponent implements OnInit, OnDestroy {
  getParamSub!: Subscription;
  joinSub!: Subscription;
  gouSub!: Subscription;
  urSub!: Subscription;
  room!: BackRoom;
  users: BackUser[] = [];
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
    if (this.getParamSub) this.getParamSub.unsubscribe();
    if (this.joinSub) this.joinSub.unsubscribe();
    if (this.gouSub) this.gouSub.unsubscribe();
    if (this.urSub) this.urSub.unsubscribe();
  }

  async ngOnInit() {
    console.log('ngOnInit');
    await this.joinToRoom();
    // 2) Підписка на зміни кімнати
    this.urSub = this.socketService
      .updateUserRoom()
      .subscribe(async ({ room, user, event }) => {
        if (event === RoomUserEvent.join) {
          if (user.id === this.authService.getUser().id) return;
          this.users.push(user);
          await this.initOtherVideo(user);
        } else if (event === RoomUserEvent.update) {
          const updatedUser = this.users.find((u) => u.id === user.id);
          if (updatedUser) updatedUser.peerId = user.peerId;
        } else if (event === RoomUserEvent.leave) {
          this.users.splice(
            this.users.findIndex((u) => u.id === user.id),
            1
          );
        }
      });
  }

  async joinToRoom(): Promise<void> {
    console.log('joinToRoom');
    this.getParamSub = this.activatedRoute.params.subscribe({
      next: ({ id }) => {
        this.joinSub = this.roomsService.join(id).subscribe({
          next: ({ room, user }) => {
            this.users.push(user);
            this.room = room;
            MaterialService.toast(`Ви війшли в кімнату "${this.room.name}"`);
          },
          error: (error) => MaterialService.toast(error.error.message),
          complete: async () => {
            await this.initMyVideo();
          },
        });
      },
      error: (error) => MaterialService.toast(error.error.message),
    });
  }

  async initOtherUsers(): Promise<void> {
    console.log('initOtherUsers');
    this.gouSub = this.roomsService.getOtherUsers(this.room.id).subscribe({
      next: (users) => {
        for (const user of users) {
          this.users.push(user);
        }
      },
      error: (error) => MaterialService.toast(error.error.message),
      complete: async () => {
        for (const user of this.users) {
          if (user.id === this.authService.getUser().id) continue;
          await this.initOtherVideo(user);
        }
      },
    });
  }

  async initMyVideo(): Promise<void> {
    console.log('initMyVideo');
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
    this.peer.on('open', async (id: string) => {
      console.log('Створення мого пір ід', id);
      this.socketService.sendPeerId(id);
      await this.initOtherUsers();
    });

    this.peer.on('call', (call: any) => {
      console.log('Коли мені дзвонять', call);
      call.answer(this.localMediaStream);
      call.on('stream', (stream: any) => {
        console.log('stream', stream);
        const user = this.users.find((u) => u.peerId === call.peer);
        const video = this.getVideoByUserId(user?.id || '');
        video.srcObject = stream;
        video.onloadeddata = () => video.play();
      });
    });
  }

  async initOtherVideo(user: BackUser): Promise<void> {
    console.log('initOtherVideo');
    const call = this.peer.call(user.peerId, this.localMediaStream);
    const currentUser = this.users.find((u) => u.id === user.id);
    if (currentUser) currentUser.localCall = call;
    call.on('stream', (stream: any) => {
      console.log('очікуємо stream', stream);
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
