import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    group
} from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MatDatepickerInputEvent } from '@angular/material';

import { SpendingService } from './spending.service';
import { AddEditSpendingDialogComponent } from './add-edit-spending-dialog/add-edit-spending-dialog.component';
import { CategoriesService } from '../categories/categories.service';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.scss'],
  animations: [
      trigger('fadeInOut', [
          // state('void', style({
          //     opacity: 0
          // })),
          // transition('void <=> *', animate(1000)),
          // transition('void => *', animate(1000)),
          // transition('* => void', animate(500)),


          state('open', style({
              height: '*',
              opacity: 1
          })),
          state('close', style({
              height: 0,
              opacity: 0
          })),
          transition('close=>open', animate('300ms')),
          transition('open=>close', animate('200ms ease-in-out'))

          // state('in', style({height: '*', opacity: 0})),
          // transition(':leave', [
          //     style({height: '*', opacity: 1}),
          //     group([
          //         animate(300, style({height: 0})),
          //         animate('200ms ease-in-out', style({'opacity': '0'}))
          //     ])
          // ]),
          // transition(':enter', [
          //     style({height: '0', opacity: 0}),
          //     group([
          //         animate(300, style({height: '*'})),
          //         animate('400ms ease-in-out', style({'opacity': '1'}))
          //     ])
          // ])
      ])
  ]
})
export class SpendingComponent implements OnInit, OnDestroy {
    submitted: boolean;
    showSuccessMessage = false;
    filterListIsOpen = false;
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

    toggleFilters() {
        this.filterListIsOpen = !this.filterListIsOpen;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.data = [];
    }
}
