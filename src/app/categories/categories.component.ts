import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { AddEditCategoryDialogComponent } from './add-edit-category-dialog/add-edit-category-dialog.component';
import { CategoriesService } from './categories.service';
import {AddEditSpendingDialogComponent} from "../spending/add-edit-spending-dialog/add-edit-spending-dialog.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  submitted: boolean;
  showSuccessMessage = false;
  subscriptions: Subscription[] = [];
  categoriesArr = [];
  constructor(
      private dialog: MatDialog,
      private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.categoriesService.getCategories()
        .subscribe(list => {
            this.categoriesArr = list.map(category => {
                return {
                    $key: category.key,
                    ...category.payload.val()
                };
            });
        }));
  }

  addCategory() {
    console.log('!! addCategory');

    const dialogRef = this.dialog.open(AddEditCategoryDialogComponent, { width: '250px' });

    dialogRef.afterClosed()
        .subscribe(result => {
          console.log('result', result);

            if (result) {
                this.submitted = true;
                this.categoriesService.addCategory(result);
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 2000);
                this.submitted = false;
            }
        })
  }

    editCategory(category) {
        const dialogRef = this.dialog.open(AddEditCategoryDialogComponent, {
            width: '250px',
            data: { ...category }
        });

        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.submitted = true;
                    this.categoriesService.updateCategory(result);
                    // this.showSuccessMessage = true;
                    // setTimeout(() => this.showSuccessMessage = false, 2000);
                    this.submitted = false;
                }
            });
    }

    deleteCategory(key) {
        if (confirm('Are you sure to delete category?')) {
            this.categoriesService.deleteCategory(key);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
