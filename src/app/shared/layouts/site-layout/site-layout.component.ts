import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { MaterialService } from '../../classes/material.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css'],
})
export class SiteLayoutComponent implements OnInit, OnDestroy {
  uSub!: Subscription;

  links = [
    { url: '/news', name: 'Новини' },
    { url: '/profile', name: 'Профіль' },
    { url: '/statistics', name: 'Статистика' },
    { url: '/rooms', name: 'Кімнати' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private socketService: SocketService
  ) {}

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

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
