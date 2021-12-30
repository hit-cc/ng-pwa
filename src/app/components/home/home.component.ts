import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireAuthService } from 'src/app/services/firebase-auth/fire-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private fireService: FireAuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.fireService.logout();
  }
}
