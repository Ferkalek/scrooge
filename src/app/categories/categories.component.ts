import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatSnackBar } from '@angular/material';

import { AddEditCategoryDialogComponent } from './add-edit-category-dialog/add-edit-category-dialog.component';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  loadingData = true;
  subscriptions: Subscription[] = [];
  categoriesArr = [];
  constructor(
      private dialog: MatDialog,
      private categoriesService: CategoriesService,
      private snackBar: MatSnackBar
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

            this.loadingData = false;
        }));
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddEditCategoryDialogComponent, { width: '250px' });

    dialogRef.afterClosed()
        .subscribe(result => {
            if (result) {
                this.categoriesService.addCategory(result);
                this.snackBar.open('Category was added successfully', '', {
                    duration: 2000,
                });
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
                    this.categoriesService.updateCategory(result);
                    this.snackBar.open('Category was changed', '', {
                        duration: 2000,
                    });
                }
            });
    }

    deleteCategory(key) {
        if (confirm('Are you sure to delete category?')) {
            this.categoriesService.deleteCategory(key);
            this.snackBar.open('Category was deleted', '', {
                duration: 2000,
            });
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
