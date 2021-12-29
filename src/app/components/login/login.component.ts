import { Component, OnInit } from '@angular/core';
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
    console.log('Form Value--', this.loginForm.value);
    if (this.loginForm.valid) {
      let formDetails = this.loginForm.value;
      this.fireAuthService.logIn(formDetails.email, formDetails.password).then(
        (res: any) => {
          console.log("Response::",res);
          
          if (res && res.operationType == 'signIn') {
            this.ngOnInit()
            this.fireAuthService.storeUserData(res.user);
            this._snackBar.open('Login Successfully !', 'close', {
              duration: 3000,
            });
          }
        },
        (err) => {
          this._snackBar.open(err, 'close', {
            duration: 3000,
          });
        }
      );
    }
  }
}
