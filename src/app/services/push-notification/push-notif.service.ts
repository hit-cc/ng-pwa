import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushNotifService {

  currentMessage = new BehaviorSubject(null);
  constructor(
    private angularFireMessaging: AngularFireMessaging,
  ) {
    this.angularFireMessaging.messages.subscribe((_msges: any) => {
      _msges.onMessage - _msges.onMessage.bind(_msges);
      _msges.onTokenRefresh = _msges.onTokenRefresh.bind(_msges);
    });

  }
  
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log('token', token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  checkPermission() {
    this.angularFireMessaging.requestPermission.subscribe(
      () => {
        console.log('Permission granted!');
      },
      (error) => {
        console.log('Permission Denied!');
        console.error(error);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      this.currentMessage.next(payload);
    });
  }
}
