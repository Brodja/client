import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GamesService } from '../shared/services/games.service';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.css']
})
export class GamesPageComponent implements OnInit{
  gameList$: Observable<string[]> | undefined;

  constructor(private games: GamesService) {}


  ngOnInit(): void {
    this.gameList$ = this.games.getAll();
  }

}
