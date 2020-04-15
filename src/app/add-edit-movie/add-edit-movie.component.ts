import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Movie } from '../movie';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-add-edit-movie',
  templateUrl: './add-edit-movie.component.html',
  styleUrls: ['./add-edit-movie.component.css']
})
export class AddEditMovieComponent implements OnInit {
  showLoading = false;
  constructor(public dialogRef: MatDialogRef<AddEditMovieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie, private movie: MovieService) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  findMovieByName(name:string) {
    console.log('=======> name ',name);
    this.showLoading = true;
    this.movie.getMovieDetails(name, "").then((res:any)=>{
      console.log("=====> ",res);
      if(res.Title) {
        this.data.name = res.Title;
        this.data.posterUrl = res.Poster;
        this.data.plot = res.Plot;
        this.data.type = res.Type;
        this.data.imdbRating = res.imdbRating;
        this.data.releaseDate = res.Released;
        this.data.year = res.Year;
      }
    }).catch(e=>console.error(e)).finally(()=>{this.showLoading = false;});

  }
}
