import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public showLoading:Boolean = false;
  public errorMessage:String = "";
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

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
  }

  signUp(): void {
    if(this.passFormControl.value !== this.repassFormControl.value) {
      this.repassFormControl.setErrors({checkPassMistmatch:true});
    }else {
      this.showLoading = true;
      this.auth.doRegister({email:this.emailFormControl.value, password: this.passFormControl.value}).then(()=>{
        alert('User Registered Successfully.');
        this.showLoading = false;
        this.router.navigate(['/login']);
      }).catch((e:Error)=>{
        console.error(e);
        this.errorMessage = e.message;
      }).finally(()=>this.showLoading = false);
    }
  }
}
