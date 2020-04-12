import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public showLoading = false;
  public errorMessage = "";
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passFormControl = new FormControl('', [
    Validators.required
  ])
  constructor(public authService: AuthService, private router: Router, private afAuth: AngularFireAuth ) {
    this.afAuth.onAuthStateChanged(user => {
      if (user) {
        console.log('User is already logged in ');
        this.router.navigate(['/dash']);
      } else {
        console.log('User Not Logged in');
      }
    });
  }

  ngOnInit(): void {
  }

  signIn() {
    console.log(this.emailFormControl.value);
    console.log(this.passFormControl.value);
    this.showLoading = true;
    this.authService.doLogin({email: this.emailFormControl.value, password: this.passFormControl.value})
    .then(res => {
      console.log('Login is Success1');
      this.showLoading = false;
      localStorage.setItem('isLoggedin', 'true');
      this.router.navigate(['/dash']);
    }).catch(err => {
      console.log(err);
      this.errorMessage = err.message;
    }).finally(()=>this.showLoading = false);
  }

}
