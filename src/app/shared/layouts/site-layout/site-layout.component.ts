import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css'],
})
export class SiteLayoutComponent {
  links = [
    { url: '/overview', name: 'Overview' },
    { url: '/profile', name: 'Profile' },
    { url: '/games', name: 'Games' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
