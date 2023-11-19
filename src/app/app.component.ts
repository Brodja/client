import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { MaterialService } from './shared/classes/material.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const potentialToken = localStorage.getItem('auth-token');
    if (potentialToken) {
      this.authService.setToken(potentialToken);
    }
  }
}
