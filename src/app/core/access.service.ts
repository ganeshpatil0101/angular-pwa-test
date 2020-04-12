import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable()
export class AccessService {
    onlyAccess: string[];
    hasAccess = false;
    currentUserId : string = '';
  constructor(
    public afAuth: AngularFireAuth
 ) {
    this.onlyAccess = ['qSf3eS04ZEPZ0umwRgSNEZziGlF3', 'Z6rVueufshZ0GckSuhbOJ69jX1o1', 'Zd6OApVGEWPxyHqfDuZivNXLaQi1'];
    this.afAuth.onAuthStateChanged(currentUser => {
        this.updateAccess(currentUser);
    });
 }
 updateAccess(currentUser) {
    if (currentUser) {
        const uid = currentUser.uid;
        for (let a = 0; a < this.onlyAccess.length; a++) {
            if (uid === this.onlyAccess[a]) {
                console.log('you are admin ');
                this.hasAccess = true;
                this.currentUserId = uid;
            }
        }
    }
 }
    getAccess() {
        return this.hasAccess;
    }
  }
