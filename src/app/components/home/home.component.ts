import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { observable, Observable } from 'rxjs';
import { FireAuthService } from 'src/app/services/firebase-auth/fire-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private fireService: FireAuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLocation();
  }

  logout() {
    this.fireService.logout();
  }

  getLocation() {
    // Create an Observable that will start listening to geolocation updates
    // when a consumer subscribes.
    const locations = new Observable((observer) => {
      let watchId: number;

      // Simple geolocation API check provides values to publish
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (position: GeolocationPosition) => {
            observer.next(position);
          },
          (error: GeolocationPositionError) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation not available');
      }

      // When the consumer unsubscribes, clean up data ready for next subscription.
      return {
        unsubscribe() {
          navigator.geolocation.clearWatch(watchId);
        },
      };
    });
  }
}
