import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css'],
})
export class SiteLayoutComponent {
  links = [
    { url: '/news', name: 'Новини' },
    { url: '/profile', name: 'Профіль' },
    { url: '/statistics', name: 'Статистика' },
    { url: '/rooms', name: 'Кімнати' },
  ];

  constructor(private auth: AuthService, private router: Router,  private socketService: SocketService) {}

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
