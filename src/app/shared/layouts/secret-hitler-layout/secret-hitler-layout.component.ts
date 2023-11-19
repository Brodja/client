import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GamesService } from '../../services/games.service';
import { IGame, IGameUser } from './secret-hitler.inerface';
import { MaterialService } from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';
import { Peer } from 'peerjs';
import { SocketService } from '../../services/socket.service';
import { BackUser, User } from '../../interfaces';

@Component({
  selector: 'app-secret-hitler-layout',
  templateUrl: './secret-hitler-layout.component.html',
  styleUrls: ['./secret-hitler-layout.component.css'],
})
export class SecretHitlerLayoutComponent implements OnInit, OnDestroy {
  getGameSub!: Subscription;
  updateOtherPeerIdSub!: Subscription;
  finishGameSub!: Subscription;
  game!: IGame;
  localVideo: any;
  localMediaStream: any;
  peer: any;
  myUser!: BackUser;
  constructor(
    private gamesService: GamesService,
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  ngOnDestroy() {
    if (this.getGameSub) this.getGameSub.unsubscribe();
    if (this.updateOtherPeerIdSub) this.updateOtherPeerIdSub.unsubscribe();
    if (this.finishGameSub) this.finishGameSub.unsubscribe();
  }

  async finishGame(): Promise<void> {
    return new Promise(async (resolve) => {
      this.getGameSub = this.gamesService
        .stopGame({ gameId: this.game.gameId })
        .subscribe({
          next: () => {},
          error: (error) => {
            MaterialService.toast(error.error.message);
          },
          complete: async () => resolve(),
        });
    });
  }

  async ngOnInit() {
    this.updateOtherPeerIdSub = this.socketService
      .updatePeerIdOtherUser()
      .subscribe(async ({ userId, peerId }) => {
        const user = this.game.users.find((u) => u.id === userId);
        if (user) {
          if (user.id === this.authService.getUser().id) return;
          user.peerId = peerId;
          this.initOtherVideo(user);
        }
      });
    this.finishGameSub = this.socketService.finishGame().subscribe(async () => {
      this.router.navigate(['/rooms']);
    });
    await this.getGame();
    await this.initMyVideo();
    await this.initVideoOtherUsers();
    this.myUser = this.authService.getUser();
  }

  async getGame(): Promise<void> {
    return new Promise(async (resolve) => {
      this.getGameSub = this.gamesService.getMyGame().subscribe({
        next: (game) => {
          console.log('game', game);
          this.game = game;
          resolve();
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
          this.router.navigate(['/rooms']);
        },
        complete: async () => {},
      });
    });
  }

  async initMyVideo(): Promise<void> {
    return new Promise(async (resolve) => {
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
        this.socketService.sendGamePeerId(id, this.game.gameId);
        resolve();
      });

      this.peer.on('call', (call: any) => {
        call.answer(this.localMediaStream);
        call.on('stream', (stream: any) => {
          const user = this.game.users.find((u) => u.peerId === call.peer);
          if (!user) return;
          const video = this.getVideoByUserId(user?.id || '');
          video.srcObject = stream;
          video.onloadeddata = () => video.play();
        });
      });
    });
  }

  async initVideoOtherUsers(): Promise<void> {
    return new Promise(async (resolve) => {
      for (const user of this.game.users) {
        if (user.id === this.authService.getUser().id) continue;
        if (user.peerId) this.initOtherVideo(user);
      }
      resolve();
    });
  }

  initOtherVideo(user: IGameUser): void {
    const call = this.peer.call(user.peerId, this.localMediaStream);
    const currentUser = this.game.users.find((u) => u.id === user.id);
    if (currentUser) currentUser.localCall = call;
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
}
