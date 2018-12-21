import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog } from '@angular/material';

import { SpendingService } from './spending.service';
import { AddEditSpendingDialogComponent } from './add-edit-spending-dialog/add-edit-spending-dialog.component';
import { CategoriesService } from '../categories/categories.service';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.scss']
})
export class SpendingComponent implements OnInit, OnDestroy {
    submitted: boolean;
    showSuccessMessage = false;
    spendingArr = [];
    categoriesArr = [];
    subscriptions: Subscription[] = [];

    constructor(
      private spendingService: SpendingService,
      private categoriesService: CategoriesService,
      private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.subscriptions.push(this.categoriesService.getCategories()
            .subscribe(list => {
                this.categoriesArr = list.map(category => {
                    return {
                        $key: category.key,
                        ...category.payload.val()
                    };
                });

                this.spendingService.getSpending()
                    .subscribe(list => {
                        this.spendingArr = list.map(item => {
                            return {
                                $key: item.key,
                                ...item.payload.val(),
                                category: this.categoriesArr.find(c => c.$key === item.payload.val().category) ?
                                    this.categoriesArr.find(c => c.$key === item.payload.val().category).title : 'No category'
                            };
                        });
                        console.log('spending', this.spendingArr);
                    })
            }));
    }

    addSpending() {
        const dialogRef = this.dialog.open(AddEditSpendingDialogComponent, { width: '250px' });

        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.submitted = true;
                    this.spendingService.addSpending(result);
                    this.showSuccessMessage = true;
                    setTimeout(() => this.showSuccessMessage = false, 2000);
                    this.submitted = false;
                }
            });
    }

    editSpending(spending) {
        const dialogRef = this.dialog.open(AddEditSpendingDialogComponent, {
            width: '250px',
            data: { ...spending }
        });

        dialogRef.afterClosed()
            .subscribe(result => {
                if (result) {
                    this.submitted = true;
                    this.spendingService.updateSpending(result);
                    // this.showSuccessMessage = true;
                    // setTimeout(() => this.showSuccessMessage = false, 2000);
                    this.submitted = false;
                }
            });
    }

    deleteSpending(key) {
        if (confirm('Are you sure to delete spending?')) {
            this.spendingService.deleteSpending(key);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
