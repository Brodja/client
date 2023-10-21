import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-secret-hitler-layout',
  templateUrl: './secret-hitler-layout.component.html',
  styleUrls: ['./secret-hitler-layout.component.css'],
})
export class SecretHitlerLayoutComponent implements OnInit, OnDestroy {
  game = { name: 'gamename' };
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnDestroy() {}
  ngOnInit() {
    console.log(this.activatedRoute.snapshot.paramMap.get('billing'));
  }
}
