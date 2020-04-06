import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passFormControl = new FormControl('', [
    Validators.required
  ])
  constructor() { }

  ngOnInit(): void {
  }

  signIn() {
    console.log(this.emailFormControl.value);
    console.log(this.passFormControl.value);
  }

}
