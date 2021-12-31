import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireAuthService } from 'src/app/services/firebase-auth/fire-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(
    private fireAuthService: FireAuthService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initializeLoginForm();
  }

  ngOnInit(): void {
    this.loginForm.reset();
    if (this.fireAuthService.isLoggedIn) {
      this.router.navigate(['home']);
    }
  }
  initializeLoginForm() {
    this.fb.group({
      email: null,
      password: null,
    });
  }

  onSubmitLoginForm() {
    if (this.loginForm.valid) {
      let formDetails = this.loginForm.value;
      this.fireAuthService.logIn(formDetails.email, formDetails.password);
    }
  }

  forgotPassword() {
    let email = this.loginForm.controls['email'].value;
    if (email) {
      this.fireAuthService.sendPasswordResetEmail(email).then(
        () => {
          this._snackBar.open(
            'Reset password link sent successfully.. !',
            'close',
            {
              duration: 3000,
            }
          );
        },
        (err) =>
          this._snackBar.open(err.message, 'close', {
            duration: 2000,
          })
      );
      this.loginForm.reset();
    } else {
      this._snackBar.open(
        'pleae Input email and click forgot password',
        'close',
        {
          duration: 3000,
        }
      );
    }
  }

  loginWithGoogle() {
    this.fireAuthService.GoogleAuth();
  }
}
