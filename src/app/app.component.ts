import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    isAuth = false;
    subscriptions: Subscription[] = [];

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
        firebase.initializeApp({
            apiKey: 'AIzaSyAKGFltr_tyAPG3HaxCfS6vNsG-1PrI-SM',
            authDomain: 'spending-list-7cd09.firebaseapp.com',
            databaseURL: 'https://spending-list-7cd09.firebaseio.com',
        });
        this.authService.checkCurrentUser();
        this.subscriptions.push(this.authService.isLogged$
            .subscribe(authState => {
                this.isAuth = authState;
            }));
    }

    logOut() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
