import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';

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
    filteredSpendingArr = [];
    categoriesArr = [];
    subscriptions: Subscription[] = [];
    totalAmount = 0;
    selectedCategories: string[] = [];

    dateFrom = null;
    dateTo = null;
    minDateFrom = new Date();
    minDateTo = new Date();
    maxDateFrom = new Date();
    maxDateTo = new Date();
    // maxDate = new Date(2018, 11, 28);

    displayedColumns = ['title', 'cost', 'category', 'date'];
    // dataSource = new MatTableDataSource<any>();

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
        this.dateFrom = new Date(this.maxDateTo.getFullYear(), this.maxDateTo.getMonth(), 1);
        this.maxDateTo.setFullYear(this.maxDateTo.getFullYear());
        this.maxDateFrom = this.maxDateTo;

        this.subscriptions.push(this.categoriesService.getCategories()
            .subscribe(list => {
                this.categoriesArr = list.map(category => {
                    return {
                        $key: category.key,
                        ...category.payload.val()
                    };
                });

                console.log('this.categoriesArr', this.categoriesArr);

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

                        const dateArr = this.spendingArr.map(i => i.date);
                        this.minDateFrom = new Date(Math.min(...dateArr));
                        this.minDateTo = this.minDateFrom;

                        this.onFilteredSpendingArr();

                        // this.dataSource.data = this.filteredSpendingArr.slice();
                    })
            }));
    }

    onFilteredSpendingArr() {
        if (this.selectedCategories.length) {
            this.filteredSpendingArr = this.spendingArr.filter(s => this.selectedCategories.indexOf(s.category) !== -1);
        } else {
            this.filteredSpendingArr = [...this.spendingArr];
        }

        if ((this.dateFrom || this.minDateFrom) && (this.dateTo || this.maxDateTo)) {
            const dateFrom = (this.dateFrom || this.minDateFrom).valueOf();
            const dateTo = (this.dateTo || this.maxDateTo).valueOf();

            this.filteredSpendingArr = this.filteredSpendingArr.filter(s => s.date >= dateFrom && s.date <= dateTo);
        }

        this.getTotalAmount();
        this.getDataForChart();
    }

    getTotalAmount() {
        this.totalAmount = this.filteredSpendingArr.reduce((a, b) => {
            return a + b.cost;
        }, 0);
    }

    getDataForChart() {
        this.data = [];
        this.filteredSpendingArr.forEach(i => {
            if (!this.data.find(e => e.name === i.category)) {
                this.data.push({
                    name: i.category,
                    value: this.filteredSpendingArr.reduce((a, b) => i.category === b.category ? a + b.cost : a, 0)
                });
            }
        });
    }

    selectDateFrom(e: MatDatepickerInputEvent<Date>) {
        this.minDateTo = e.value;
        this.onFilteredSpendingArr();
    }

    selectDateTo(e: MatDatepickerInputEvent<Date>) {
        this.maxDateFrom = e.value;
        this.onFilteredSpendingArr();
    }

    clearFilters() {
        this.selectedCategories = [];
        this.dateFrom = new Date(this.maxDateTo.getFullYear(), this.maxDateTo.getMonth(), 1);
        this.dateTo = null;
        this.onFilteredSpendingArr();
    }

    onSelect(event) {
        console.log(event);
    }

    filteredByCategories() {
        this.onFilteredSpendingArr();
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
        this.data = [];
    }
}
