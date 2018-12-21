import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class CategoriesService {
    categoriesList: AngularFireList<any>;
    urlBD = '';

    constructor(
        private firebase: AngularFireDatabase,
        private authService: AuthService
    ) {}

    getCategories() {
        this.urlBD = this.authService.getUser().userId + '/categories';
        this.categoriesList = this.firebase.list(this.urlBD);
        return this.categoriesList.snapshotChanges();
    }

    addCategory(category) {
        this.categoriesList.push({ title: category.title });
    }

    updateCategory(category) {
        this.categoriesList.update(category.$key, { title: category.title });
    }

    deleteCategory(key) {
        this.categoriesList.remove(key);
    }

}
