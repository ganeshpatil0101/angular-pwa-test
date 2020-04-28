import { Component, OnInit, NgZone } from '@angular/core';
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
  hide = true;  
  constructor(public authService: AuthService, 
    private router: Router, 
    private afAuth: AngularFireAuth, 
    private ngzone : NgZone ) {
    this.afAuth.onAuthStateChanged(user => {
      let isLoggedin = localStorage.getItem('isLoggedin');
      //isLoggedin == 'true' && 
      if (user) {
        console.log('User is already logged in ');
        this.ngzone.run(()=>{
          this.router.navigate(['/dash']);
        });
        localStorage.setItem('isLoggedin', 'true');
      } else {
        console.log('User Not Logged in');
      }
    });
  }

  ngOnInit(): void {
  }

  signIn() {
    this.showLoading = true;
    this.authService.doLogin({email: this.emailFormControl.value, password: this.passFormControl.value})
    .then(res => {
      this.showLoading = false;
      localStorage.setItem('isLoggedin', 'true');
      this.router.navigate(['/dash']);
    }).catch(err => {
      console.error(err);
      this.errorMessage = err.message;
    }).finally(()=>this.showLoading = false);
  }

}
