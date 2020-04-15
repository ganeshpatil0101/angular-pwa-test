import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firebase } from '../../src/environments/config';
import { Movie } from './movie';
import {AngularFirestoreCollection, AngularFirestore} from '@angular/fire/firestore';
import { AuthService } from './core/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
const API_KEY = firebase.api_key;
const API_URL = 'http://www.omdbapi.com/';
import {DeferredPromise} from './core/DefferePromise';

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

  getMoviesCollection():Promise<AngularFirestoreCollection> {
    return this.dpromise.promise;
  }
}