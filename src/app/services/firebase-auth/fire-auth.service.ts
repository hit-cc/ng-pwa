import { Injectable, NgZone } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  device_token: null;
}

@Injectable({
  providedIn: 'root',
})
export class FireAuthService {
  userData: any;
  user: any;
  div_token: any;
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', '');
      }
    });
  }

  // Sign in with email/password
  logIn(email: any, password: any) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    var result = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.sendEmailVerification();
    return result;
  }

  async sendEmailVerification() {
    await this.afAuth.currentUser.then(
      (user) => {
        if (user) {
          user.sendEmailVerification().then(
            (res: any) => {
              console.log('Send Varific Emali Res::', res);
            },
            (error) => {
              console.log(error);
            }
          );
        } else {
          console.log('no user found!!');
        }
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  logout() {
    console.log('in service');
    this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  get isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    if (user && user !== '') {
      return true;
    }
    return false;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  storeUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      device_token: this.div_token,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  getCurrentUserData() {
    this.afAuth.currentUser.then(
      (data: any) => {
        console.log('Data---', data);
      },
      (error) => {
        console.log('getCurrentUser Error', error);
      }
    );
  }

  getDeviceToken(token: string) {
    if (token !== '') {
      this.div_token = token || null;
    }
  }
}
