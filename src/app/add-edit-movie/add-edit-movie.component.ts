import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Movie } from '../movie';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MovieService } from '../movie.service';
import { FormControl } from '@angular/forms';
import { Observable, of   } from 'rxjs';
import {map, startWith, debounceTime, switchMap} from 'rxjs/operators';
@Component({
  selector: 'app-add-edit-movie',
  templateUrl: './add-edit-movie.component.html',
  styleUrls: ['./add-edit-movie.component.css']
})
export class AddEditMovieComponent implements OnInit {
  showLoading = false;
  movieCtrl = new FormControl();
  filteredMovies: Observable<{ results: Movie[]}>;
  disFn:Function;
  constructor(public dialogRef: MatDialogRef<AddEditMovieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie, private movie: MovieService) {
      
      this.filteredMovies = this.movieCtrl.valueChanges
      .pipe(  
        startWith(''),
        // delay emits
        debounceTime(500),
        // use switch map so as to cancel previous subscribed events, before creating new once
        switchMap(value => {
          if (value !== '') {
            // search from movie db
            if(this.data.type == "movie") {
              return this.searchByMovieName(value);
            } else if(this.data.type == "series") {
              return this.searchByTvSeriesName(value);
            }
          } else {
            // if no value is present, return null
            return of(null);
          }
        })
      );
      this.disFn = this.displayFn.bind(this);
      this.mapToMovie.bind(this);
     }



  displayFn(selectedMovie) {
    if(this.data.type === "movie") {
      if(selectedMovie) this.mapToMovie(selectedMovie);
      if(selectedMovie && selectedMovie.original_title){
        return selectedMovie.original_title;
      } else if(selectedMovie && selectedMovie.title) {
        return selectedMovie.title;
      }
    } else if(this.data.type === 'series') {
      if(selectedMovie) this.mapToTvSeries(selectedMovie);
      if(selectedMovie && selectedMovie.original_name) {
        return selectedMovie.original_name;
      } 
    }
    return ''
  }
  mapToMovie(dbData) {
    this.data.name = dbData.original_title;
    this.data.posterUrl = this._createImgUrl(dbData.poster_path);
    this.data.plot = dbData.overview;
    this.data.imdbRating = dbData.vote_average;
    this.data.releaseDate = dbData.release_date;
    this.data.year = dbData.release_date.split("-")[0];
  }
  mapToTvSeries(dbData) {
    this.data.name = dbData.original_name;
    this.data.posterUrl = this._createImgUrl(dbData.poster_path);
    this.data.plot = dbData.overview;
    this.data.imdbRating = dbData.vote_average;
    this.data.releaseDate = dbData.first_air_date;
    this.data.year = dbData.first_air_date.split("-")[0];
  }
  _createImgUrl(poster_path) {
    if(poster_path) {
      return 'https://image.tmdb.org/t/p/w300'+poster_path;
    }
    return "";
  }
  searchByMovieName(name:String) {
    return this.movie.searchMovieName(name).pipe(
      map(results => results.results)
    )
  }
  searchByTvSeriesName(name:String) {
    return this.movie.searchTvSeries(name).pipe(
      map(results => results.results)
    )
  }
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  findMovieByName(name:string) {
    this.showLoading = true;
    this.movie.getMovieDetails(name, "").then((res:any)=>{
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

  // private _filterMovies(value: string): Movies[] {
  //   const filterValue = value.toLowerCase();    
  //   return this.movieData.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  // }


}
