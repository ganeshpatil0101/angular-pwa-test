import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEditMovieComponent } from '../add-edit-movie/add-edit-movie.component';
import { MovieService } from '../movie.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { Movie } from '../movie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public movieList: Observable<any[]>;
  constructor(private auth:AuthService, 
    private ngzone:NgZone, 
    private router:Router, 
    public dialog: MatDialog,
    private movie: MovieService,
    private device:DeviceDetectorService) { }
    
  ngOnInit(): void {
    this.movie.getMoviesCollection().then((movieCollection)=>{
      this.movieList = movieCollection.valueChanges();
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddEditMovieComponent, {
      width: this.device.isMobile() ? '100%' : '50%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result && result.name){
        this.movie.saveMovie(result).then(()=>{
          console.log("saved ");
        }).catch(e=>console.error(e));
        // this.movie.getWebSeriseDetails('Arrow', 2).then((res)=>{
        //   console.log(res);
        // }).catch(e => console.error(e));
      }
    });
  }
  
  logout() {
    this.auth.doLogout().then(()=>{
      this.ngzone.run(()=>{
        this.router.navigate(['/login']);
      })
    })
  }
}
