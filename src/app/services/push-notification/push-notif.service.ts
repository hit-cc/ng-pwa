import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject, mergeMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FireAuthService } from '../firebase-auth/fire-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class PushNotifService {
  currentMessage = new BehaviorSubject(null);
  registrationTokens = [];
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    public afStorage: AngularFirestore,
    private firAuthService: FireAuthService,
    private _snackBar: MatSnackBar
  ) {
    this.angularFireMessaging.messages.subscribe((_msges: any) => {
      _msges.onMessage = _msges.onMessage.bind(_msges);
      _msges.onTokenRefresh = _msges.onTokenRefresh.bind(_msges);
    });
  }

  /**
   * This method check firebase permission
   * if permission granted then request for device token
   * else throw error
   */
  requestPermission() {
    this.angularFireMessaging.requestPermission.subscribe(
      () => {
        console.log('Permission granted!');
        this.requestDeviceToken();
      },
      (error) => {
        console.log('Permission Denied!');
        this._snackBar.open(error.message, 'close');
      }
    );
  }

  /**
   * request for Device token to firebase if permission granted
   * pass device token with getDeviceToken method
   */
  requestDeviceToken() {
    this.angularFireMessaging.requestToken.subscribe(
      (token: any) => {
        console.log('Device_Token', token);
        this.firAuthService.getDeviceToken(token);
      },
      (err) => {
        console.error('Permission denied to get device token..!');
        this._snackBar.open(err.message, 'close');
      }
    );
  }

  /**
   * get notification response here
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload: any) => {
      console.log('new message received. ', payload);
      this.currentMessage.next(payload);
      this.showCustomeNotification(payload);
    });
  }

  // deleteToken() {
  //   this.angularFireMessaging.getToken
  //     .pipe(mergeMap((token:any) => this.angularFireMessaging.deleteToken(token)))
  //     .subscribe((token) => {
  //       console.log('Token listsss:::-', token);
  //     });
  // }

  /**
   * @param payload
   * this method set custome body,icon,bagde to notification
   *  also we can add redirecton link to redirect specific url on click notification
   */
  showCustomeNotification(payload: any) {
    let notify_data = payload['notification'];
    let title = notify_data['title'];
    let option = {
      body: notify_data['body'],
      icon: './assets/icons/icon-128x128.png',
      badge: './assets/icons/icon-128x128.png',
      image: './assets/icons/icon-128x128.png',
    };
    let notify: Notification = new Notification(title, option);

    notify.onclick = (event) => {
      event.preventDefault();
    };
  }


  setBackgroundMessageHandler(){

    // messaging.setBackgroundMessageHandler(function (payload) {
    //   console.log("setBackgroundMessageHandler background message ", payload);
  
    //   const promiseChain = clients
    //     .matchAll({
    //       type: "window",
    //       includeUncontrolled: true,
    //     })
    //     .then((windowClients) => {
    //       for (let i = 0; i < windowClients.length; i++) {
    //         const windowClient = windowClients[i];
    //         windowClient.postMessage(payload);
    //       }
    //     })
    //     .then(() => {
    //       return self.registration.showNotification("my notification title");
    //     });
    //   return promiseChain;
    // });
  }
}
