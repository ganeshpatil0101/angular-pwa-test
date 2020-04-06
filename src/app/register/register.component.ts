import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passFormControl = new FormControl('', [
    Validators.required
  ])
  repassFormControl = new FormControl('', [
    Validators.required
  ])

  constructor() { }

  ngOnInit(): void {
  }

  signUp(): void {
    console.log("Register User");
    if(this.passFormControl.value !== this.repassFormControl.value) {
      this.repassFormControl.setErrors({checkPassMistmatch:true});
    }
    console.log(this.emailFormControl.value, this.passFormControl.value, this.repassFormControl.value);
  }
}
