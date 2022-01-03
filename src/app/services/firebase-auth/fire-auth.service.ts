import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
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
  user: any;
  div_token: any;
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.checkAuthState();
  }

  /**  Saving user data in localstorage when
   *logged in and setting up null when logged out
   */
  checkAuthState() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        // this.router.navigate(['/home']);
      } else {
        localStorage.setItem('user', '');
      }
    });
  }

  /**
   * Login with Firebse through email & password
   * @param email
   * @param password
   * @returns
   */
  logIn(email: any, password: any) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((res: any) => {
        console.log('res', res);
        this.router.navigate(['home']);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.storeUserData(res.user);
        this._snackBar.open('Login Successfully !', 'close', {
          duration: 3000,
        });
      })
      .catch((err) => {
        this._snackBar.open(err.message, 'close', {
          duration: 2000,
        });
      });
  }

  /**
   * Register with firebase through email & password
   * then send email for verification
   * @param email
   * @param password
   * @returns result
   */
  async register(email: string, password: string) {
    var result = await this.afAuth.createUserWithEmailAndPassword(
      email,
      password
    );
    this.sendEmailVerification();
    return result;
  }

  /**
   * After register verification email send to email
   */
  async sendEmailVerification() {
    await this.afAuth.currentUser.then(
      (user) => {
        if (user) {
          user.sendEmailVerification().then(
            () => {
              console.log('sendEmailVerification success!, Check your email');
            },
            (error) => {
              console.log('sendEmailVerification fail.');
              this._snackBar.open(error.message, 'close', {
                duration: 3000,
              });
            }
          );
        } else {
          console.log('No user found!!');
        }
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }

  /**
   * Forgot password from here
   * @param passwordResetEmail
   * @returns
   */
  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  /**
   * Logout
   */
  logout() {
    this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  /**
   * check user is LogedIn or Not
   * return true / fasle
   */
  get isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    if (user && user !== '') {
      return true;
    }
    return false;
  }

  /** Setting up user data when sign in with email/password,
   *  sign up with email/password and sign in with email/password
   *  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service
   *  store user details with device token
   */
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

  /**
   * get current user information with this method
   * return user information
   */
  getCurrentUserData() {
    this.afAuth.currentUser.then(
      (data: any) => {
        if (data) {
          return data;
        }
      },
      (error) => {
        console.log('Error to get current user data', error);
        this._snackBar.open(error.message, 'close', {
          duration: 3000,
        });
      }
    );
  }

  /**
   * if geting token then set to div_token variable
   * else set null
   * @param token
   */
  getDeviceToken(token: string) {
    if (token !== '') {
      this.div_token = token || null;
    }
  }

  /**
   * LOGIN WITH GOOGLE POPUP WINDOW
   *
   */

  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.router.navigate(['/home']);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.storeUserData(result.user);
        this._snackBar.open('You have been successfully logged in!', 'close', {
          duration: 3000,
        });
      })
      .catch((error) => {
        this._snackBar.open(error.message, 'close', {
          duration: 3000,
        });
      });
  }
}
