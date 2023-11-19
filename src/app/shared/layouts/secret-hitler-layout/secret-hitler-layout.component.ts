import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GamesService } from '../../services/games.service';
import { GlobalRole, IGame, IGameUser } from './secret-hitler.inerface';
import {
  MaterialInstance,
  MaterialService,
} from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';
import { Peer } from 'peerjs';
import { SocketService } from '../../services/socket.service';
import { BackUser, User } from '../../interfaces';

@Component({
  selector: 'app-secret-hitler-layout',
  templateUrl: './secret-hitler-layout.component.html',
  styleUrls: ['./secret-hitler-layout.component.css'],
})
export class SecretHitlerLayoutComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('modal') modalRef!: ElementRef;
  modal: MaterialInstance | any;
  getGameSub!: Subscription;
  updateOtherPeerIdSub!: Subscription;
  finishGameSub!: Subscription;
  initUserSub!: Subscription;
  game!: IGame;
  localVideo: any;
  localMediaStream: any;
  peer: any;
  myUser!: BackUser;
  myGameUser!: IGameUser;
  otherRedUsers: string[] = [];
  constructor(
    private gamesService: GamesService,
    private router: Router,
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  async ngOnInit() {
    // Підписка і очікування юзера з беку
    await this.initUser();
    // Підписка на підключення
    this.updateOtherPeerIdSub = this.socketService
      .updatePeerIdOtherUser()
      .subscribe(async ({ userId, peerId }) => {
        const user = this.game.users.find((u) => u.id === userId);
        if (user) {
          if (user.id === this.myUser.id) return;
          user.peerId = peerId;
          this.initOtherVideo(user);
        }
      });

    // Підписка і очікування стейту гри з беку
    await this.initGame();
    // Ініт мого потоку відео
    await this.initMyVideo();
    // підключення потоків інших юзерів
    await this.initVideoOtherUsers();
    // Підписка на закінчення гри
    this.finishGameSub = this.socketService
      .finishGame()
      .subscribe(async () => this.router.navigate(['/rooms']));
  }

  ngOnDestroy() {
    if (this.getGameSub) this.getGameSub.unsubscribe();
    if (this.updateOtherPeerIdSub) this.updateOtherPeerIdSub.unsubscribe();
    if (this.finishGameSub) this.finishGameSub.unsubscribe();
    if (this.initUserSub) this.initUserSub.unsubscribe();
    this.modal?.destroy();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  async initUser(): Promise<void> {
    return new Promise(async (resolve) => {
      this.initUserSub = this.authService.initUser().subscribe({
        next: (user) => {
          this.myUser = user;
          this.authService.setUser(user);
          resolve();
        },
        error: (error) => MaterialService.toast(error.error.message),
      });
    });
  }

  async initGame(): Promise<void> {
    return new Promise(async (resolve) => {
      this.getGameSub = this.gamesService.getMyGame().subscribe({
        next: (game) => {
          this.game = game;
          this.renderTable(game.liberalAdoptedLaw, game.fascistAdoptedLaws, game.voteCounter);
          this.myGameUser = game.users.find(
            (u: IGameUser) => u.id === this.myUser.id
          );
          if (!game.liberalAdoptedLaw && !game.fascistAdoptedLaws) {
            if (this.myGameUser.globalRole !== GlobalRole.liberal) {
              this.otherRedUsers = game.users
                .filter(
                  (u: IGameUser) =>
                    u.globalRole !== GlobalRole.liberal &&
                    u.id !== this.myUser.id
                )
                .map((u: IGameUser) => u.login);
            }

            this.modal.open();
          }
          resolve();
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
          this.router.navigate(['/rooms']);
        },
      });
    });
  }

  renderTable(lib: number, fas: number, counter: number): void {
    setTimeout(() => {
      for (let i = 0; i < lib; i++) {
        const id = `liberal_low_${i + 1}`;
        const element = document.getElementById(id);
        if (element) element.classList.remove('hide');
      }
      for (let i = 0; i < fas; i++) {
        const element = document.getElementById(`fascist_low_${i + 1}`);
        if (element) element.classList.remove('hide');
      }
      for (let i = 0; i < 4; i++) {
        const element = document.getElementById(`tracker_${i + 1}`);
        if (i === counter) {
          if (element) element.classList.remove('hideOpacity');
        } else {
          if (element) {
            if (!element.classList.contains('hideOpacity')) {
              element.classList.add('hideOpacity');
            }
          }
        }
      }
    }, 500);
  }

  async initMyVideo(): Promise<void> {
    return new Promise(async (resolve) => {
      this.localMediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            min: 320,
            ideal: 480,
            max: 1280,
          },
          height: {
            min: 240,
            ideal: 360,
            max: 720,
          },
          frameRate: { ideal: 25, max: 30 },
        },
        audio: true,
      });
      const myId: string = this.myUser.id.toString();
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
        if (user.id === this.myUser.id) continue;
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

  gotAcquainted() {
    this.modal.close();
  }
}
