import { Component, OnInit } from '@angular/core';
import { SocketService } from '../shared/services/socket.service';

@Component({
  selector: 'app-desk-page-sh',
  templateUrl: './desk-page-sh.component.html',
  styleUrls: ['./desk-page-sh.component.css'],
})
export class DeskPageShComponent implements OnInit {
  data: any;
  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.socketService.sendTest();
    // this.socketService.onSendTest().subscribe((data: any) => {
    //   this.data = data
    //   console.log('data', data);
    // })
  }
}
