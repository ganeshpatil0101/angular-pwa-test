import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private auth:AuthService, private ngzone:NgZone, private router:Router) { }

  ngOnInit(): void {
  }
  
  logout() {
    this.auth.doLogout().then(()=>{
      this.ngzone.run(()=>{
        this.router.navigate(['/login']);
      })
    })
  }
}
