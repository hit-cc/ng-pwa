import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FireAuthService } from 'src/app/services/firebase-auth/fire-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
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
      this.router.navigate(['/home']);
    }
  }

  initializeLoginForm() {
    this.fb.group({
      email: null,
      password: null,
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      let formDetails = this.registerForm.value;
      this.fireAuthService
        .register(formDetails.email, formDetails.password)
        .then(
          (res: any) => {
            console.log('Register Response::', res);
            if (res && res.additionalUserInfo.isNewUser) {
              this._snackBar.open('New User Added Successfully!!');
              this.router.navigate(['/login']);
            }
          },
          (error) => {
            this._snackBar.open(error, 'close', {
              duration: 3000,
            });
          }
        );
    }
  }
}
