import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { MaterialService } from './shared/classes/material.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const potentialToken = localStorage.getItem('auth-token');
    if (potentialToken) this.authService.setToken(potentialToken);
    this.authService.initUser().subscribe(
      (user) => {
        this.authService.setUser(user);
      },
      (error) => {
        MaterialService.toast(error.error.message);
      }
    );
  }
}
