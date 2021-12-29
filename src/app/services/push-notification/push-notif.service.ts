import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { getMessaging, getToken } from 'firebase/messaging';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireAuthService } from '../firebase-auth/fire-auth.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotifService {
  currentMessage = new BehaviorSubject(null);
  registrationTokens = [];
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public afStorage: AngularFirestore,
    private firAuthService:FireAuthService
  ) {
    this.angularFireMessaging.messages.subscribe((_msges: any) => {
      _msges.onMessage = _msges.onMessage.bind(_msges);
      _msges.onTokenRefresh = _msges.onTokenRefresh.bind(_msges);
    });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token:any) => {
        console.log('token', token);
        this.firAuthService.getDeviceToken(token)
        this.sendMultipleMesg();
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
      this.showCustomeNotification(payload);
    });
  }

  deleteToken() {
    this.angularFireMessaging.getToken
      // .pipe(mergeMap((token) => this.angularFireMessaging.deleteToken(token)))
      .subscribe((token) => {
        console.log('Token listsss:::-', token);
      });
  }

  sendMultipleMesg() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.PUBLIC_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // ...
          console.log('currentToken::::::::::::::::::', currentToken);
        } else {
          // Show permission request UI
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
      });
  }

  showCustomeNotification(payload: any) {
    let notify_data = payload['notification'];
    let title = notify_data['title'];
    let option = {
      body: notify_data['body'],
      icon: './assets/icons/icon-128x128.png',
      badge: './assets/icons/icon-128x128.png',
      image: './assets/icons/icon-128x128.png',
    };
    console.log('new Message ::-', notify_data);
    let notify: Notification = new Notification(title, option);

    notify.onclick = (event) => {
      event.preventDefault();
    };
  }

  saveTokens(user: any, token: string) {
    console.log('user::-', user);
    
    const currentTokens = user.fcmTokens || { }
    console.log('token---------', token);
    // If token does not exist in firestore, update db
    if (!currentTokens[token]) {
      const userRef = this.afStorage.collection('device_token').doc(user.uid);
      const tokens = { ...currentTokens, [token]: true };
      userRef.update({ fcmTokens: tokens });
    }
  }
}
