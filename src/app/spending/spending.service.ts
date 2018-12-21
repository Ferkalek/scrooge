import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';

import { Spending } from './spending.model';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SpendingService {
    spendingList: AngularFireList<any>;
    urlBD = '';

    constructor(
        private firebase: AngularFireDatabase,
        private authService: AuthService
    ) {}

    getSpending() {
        this.urlBD = this.authService.getUser().userId;
        this.spendingList = this.firebase.list(this.urlBD);
        return this.spendingList.snapshotChanges();
    }

    addSpending(spending) {
        this.spendingList.push({
            title: spending.title,
            cost: spending.cost,
            category: spending.category ? spending.category : 'No category',
            date: Date.now()
        });
    }

    updateSpending(spending) {
        this.spendingList.update(spending.$key, {
            title: spending.title,
            cost: spending.cost,
            category: spending.category ? spending.category : 'No category'
        });
    }

    deleteSpending(key) {
        this.spendingList.remove(key);
    }

}
