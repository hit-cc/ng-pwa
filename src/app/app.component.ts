import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { MainService } from './services/main.service';
import { PushNotifService } from './services/push-notification/push-notif.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng-pwa';
  message: any;
  constructor(
    private updates: SwUpdate,
    private mainService: MainService,
    private pushNotifService: PushNotifService,
    private afMessaging: AngularFireMessaging,
    private push: SwPush
  ) {
    this.updates.available.subscribe((update) => {
      console.log('Service Worker updated...!');
    });

    this.push.messages.subscribe((message) => {
      console.log('Messsage------::', message);
    });
  }

  // getLocation() {
  //   this.mainService.getPosition().then((pos) => {
  //     console.log(`Positon: ${pos.lng} ${pos.lat}`);
  //   });
  // }

  ngOnInit(): void {
    // this.getLocation();
    this.pushNotifService.checkPermission();
    this.pushNotifService.requestPermission();
    this.pushNotifService.receiveMessage();
    this.message = this.pushNotifService.currentMessage;
    this.pushNotifService.listen();
  }
}
