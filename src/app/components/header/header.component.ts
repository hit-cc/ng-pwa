import { Component, OnInit } from '@angular/core';
import { FireAuthService } from 'src/app/services/firebase-auth/fire-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private fireService: FireAuthService) {}

  ngOnInit(): void {}

  logout() {
    this.fireService.logout();
  }
}
