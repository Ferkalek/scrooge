import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatTableDataSource } from '@angular/material';

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
    totalAmount = 0;

    displayedColumns = ['title', 'cost', 'category', 'date'];
    dataSource = new MatTableDataSource<any>();

    data = [];

    view = [545, 375];

    // options
    showLegend = false;
    gradient = false;

    colorScheme = {
        domain: ['#46b6ac', '#08328c', '#db4b4b', '#804c9e']
    };

    // pie
    showLabels = true;
    explodeSlices = false;
    doughnut = true;

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

                        this.totalAmount = this.spendingArr.reduce((a, b) => {
                            return a + b.cost;
                        }, 0);

                        this.spendingArr.forEach(i => {
                            if (!this.data.find(e => e.name === i.category)) {
                                this.data.push({
                                    name: i.category,
                                    value: this.spendingArr.reduce((a, b) => i.category === b.category ? a + b.cost : a, 0)
                                });
                            }
                        });

                        this.dataSource.data = this.spendingArr.slice();
                    })
            }));
    }

    onSelect(event) {
        console.log(event);
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
