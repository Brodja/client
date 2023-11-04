import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { MaterialService } from './shared/classes/material.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit, OnDestroy {
  uSub!: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy() {
    if (this.uSub) this.uSub.unsubscribe();
  }

  ngOnInit(): void {
    const potentialToken = localStorage.getItem('auth-token');
    if (potentialToken) {
      this.authService.setToken(potentialToken);
      this.uSub = this.authService.initUser().subscribe(
        (user) => {
          this.authService.setUser(user);
          if (user?.currentGame) {
            if (this.router.url !== user?.currentGame?.type) {
              this.router.navigate([`../${user?.currentGame?.type}`]);
            }
          }
        },
        (error) => {
          MaterialService.toast(error.error.message);
        }
      );
    }
  }
}
