import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MainService } from './services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng-pwa';
  constructor(private updates: SwUpdate, private mainService: MainService) {
    this.updates.available.subscribe((event) => {
      console.log('new updates available', event);
      updates.activateUpdate().then(() => document.location.reload());
    });
  }

  getLocation() {
    this.mainService.getPosition().then((pos) => {
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
    });
  }

  ngOnInit(): void {
    this.getLocation();
  }
}
