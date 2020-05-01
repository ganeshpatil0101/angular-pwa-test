import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firebase } from '../../src/environments/config';
import { Movie } from './movie';
import {AngularFirestoreCollection, AngularFirestore} from '@angular/fire/firestore';
import { AuthService } from './core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
const API_KEY = firebase.api_key;
const API_URL = 'http://www.omdbapi.com/';
const NEW_API_KEY = 'a0d799999273a3494dd3b0da1f44893c';
const NEW_MOVIE_API = 'https://api.themoviedb.org/3/search/movie?api_key='+NEW_API_KEY;
const NEW_TV_API = 'https://api.themoviedb.org/3/search/tv?api_key='+NEW_API_KEY;

import {DeferredPromise} from './core/DefferePromise';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movieCollection: AngularFirestoreCollection<Movie>;
  private userId:string;
  private dpromise = new DeferredPromise<AngularFirestoreCollection>();

  constructor( private http: HttpClient, private afs: AngularFirestore,
    private auth: AngularFireAuth) { 
      this.auth.authState.subscribe((user)=>{
        this.userId = user.uid;
        this.movieCollection = afs.collection<Movie>('movies-'+this.userId);
        this.dpromise.resolve(this.movieCollection);
      });
  }

  getMovieDetails(movieName:string, category:string) {
    return this.http.get(`${API_URL}?t=${movieName}&apikey=${API_KEY}`).toPromise();
  }

  getWebSeriseDetails(name:String, season:number) {
    //TODO
    return this.http.get(`${API_URL}?t=${name}&Season=${season}&apikey=${API_KEY}`).toPromise();
  }

  saveMovie(data:Movie) {
    return this.movieCollection.add(data);
  }
  udpateMovie(docId:string, data:Movie) {
    if(docId){
      return this.movieCollection.doc(docId).update(data);
    }
    return new Promise((res, rej)=>{rej('ID not present , data not updated ')});
  }
  getMoviesCollection():Promise<AngularFirestoreCollection> {
    return this.dpromise.promise;
  }

  searchMovieName(name:String): Observable<{ results: Movie[]}> {
    return this.http
      .get<{ results: Movie[]}>(NEW_MOVIE_API+"&query="+name+"&language=en-US&page=1&include_adult=false", {
        observe: 'response'
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
  searchTvSeries(name:String): Observable<{ results: Movie[]}> {
    return this.http
      .get<{ results: Movie[]}>(NEW_TV_API+"&query="+name+"&language=en-US&page=1&include_adult=false", {
        observe: 'response'
      })
      .pipe(
        map(res => {
          return res.body;
        })
      );
  }
}