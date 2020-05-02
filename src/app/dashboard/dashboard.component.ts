import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEditMovieComponent } from '../add-edit-movie/add-edit-movie.component';
import { MovieService } from '../movie.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { Movie } from '../movie';
import {cloneDeep} from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public movieList: any;
  public copyItems: any;
  public isWatchedMovie:boolean = false;
  constructor(private auth:AuthService, 
    private ngzone:NgZone, 
    private router:Router, 
    public dialog: MatDialog,
    private movie: MovieService,
    private device:DeviceDetectorService) { }
    
  ngOnInit(): void {
    this.movie.getMoviesCollection().then((movieCollection)=>{
      movieCollection.snapshotChanges().subscribe((res)=>{
        this.movieList = res;
        this.copyItems = cloneDeep(res);
      });
    })
  }

  openDialog(type:string) {
    const dialogRef = this.dialog.open(AddEditMovieComponent, {
      width: this.device.isMobile() ? '100%' : '50%',
      data: {
        type:type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.name){
        this.movie.saveMovie(result).then(()=>{
        }).catch(e=>console.error(e));
      }
    });
  }
  onEdit(data) {
    this.openEditDialog(data);
  }
  searchWatched() {
    this.isWatchedMovie = !this.isWatchedMovie;
    this.movieList = cloneDeep(this.copyItems);
    this.movieList = this.movieList.filter((item) => {
      return item.payload.doc.data().watched === this.isWatchedMovie;
    });
  }
  searchByType(type){
    this.movieList = cloneDeep(this.copyItems);
    if(type === 'all') return;
    this.movieList = this.movieList.filter((item)=>{
      return item.payload.doc.data().type === type;
    })
  }
  openEditDialog(data) {
    const movieData:Movie = data.payload.doc.data();
    const docId = data.payload.doc.id;
    movieData.id = docId;
    const dialogRef = this.dialog.open(AddEditMovieComponent, {
      width: this.device.isMobile() ? '100%' : '50%',
      data: movieData
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.name && docId){
        this.movie.udpateMovie(docId, result).then(()=>{
        }).catch(e=>console.error(e));
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
