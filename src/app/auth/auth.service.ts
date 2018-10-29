import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { StorageService } from '../shared/services/storage.service';

@Injectable()
export class AuthService {
    private user: User = null;
    isLogged$ = new BehaviorSubject<boolean>(false);

  constructor(
      private router: Router,
      private storageService: StorageService,
  ) { }


  registrUser(authData: AuthData) {
      firebase.auth().createUserWithEmailAndPassword(authData.email, authData.password)
          .then(() => this.router.navigate(['/login']))
          .catch(error => console.log(error));
  }

  login(authData: AuthData) {
      firebase.auth().signInWithEmailAndPassword(authData.email, authData.password)
          .then(response => {
              firebase.auth().currentUser.getIdToken()
                  .then(
                      token => {
                          const user = {
                              uid: response.user.uid,
                              email: response.user.email,
                              token: token,
                          };

                          if (user && user.token) {
                              this.storageService.setItem('currentUser', JSON.stringify(user));
                          }

                          this.user = {
                              email: user.email,
                              userId: user.uid
                          };

                          this.isLogged$.next(true);

                          this.router.navigate(['/main']);

                          return user;
                      }
                  );
          })
          .catch(error => console.log(error));
  }

  logout() {
      this.storageService.deleteItem('currentUser');
      this.user = null;
      this.isLogged$.next(false);
      this.router.navigate(['/login']);
  }

  checkCurrentUser() {
      const user = this.storageService.getItem('currentUser');
      if (user !== null) {
          this.isLogged$.next(true);
          const {email, uid} = JSON.parse(user);
          this.user = {
              email: email,
              userId: uid
          };
      } else {
          this.user = null;
      }
  }

  getUser() {
      return {...this.user};
  }

  isAuth() {
      return this.user != null;
  }

}
