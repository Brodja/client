import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GamesService } from '../../services/games.service';
import { IGame } from './secret-hitler.inerface';
import { MaterialService } from '../../classes/material.service';

@Component({
  selector: 'app-secret-hitler-layout',
  templateUrl: './secret-hitler-layout.component.html',
  styleUrls: ['./secret-hitler-layout.component.css'],
})
export class SecretHitlerLayoutComponent implements OnInit, OnDestroy {
  getGameSub!: Subscription;
  game!: IGame;
  constructor(private gamesService: GamesService, private router: Router) {}

  ngOnDestroy() {
    if (this.getGameSub) this.getGameSub.unsubscribe();
  }
  async ngOnInit() {
    await this.getGame();
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
}
