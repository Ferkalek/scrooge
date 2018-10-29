import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { SpendingService } from './spending.service';
import { Spending } from './spending.model';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.scss']
})
export class SpendingComponent implements OnInit, OnDestroy {
    submitted: boolean;
    showSuccessMessage = false;
    mForm: FormGroup;
    spendingArr = [];
    subscriptions: Subscription[] = [];

    constructor(
      private spendingService: SpendingService
    ) {}

    ngOnInit() {
        this.subscriptions.push(this.spendingService.getSpending()
            .subscribe(list => {
                this.spendingArr = list.map(item => {
                    return {
                        $key: item.key,
                        ...item.payload.val()
                    };
                });
            }));
        this.mForm = new FormGroup({
            '$key': new FormControl(null),
            'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
            'cost': new FormControl(null, Validators.required)
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.mForm.valid) {
            if (this.mForm.get('$key').value == null) {
                // insert (add new)
                this.spendingService.addSpending(this.mForm.value);
                this.showSuccessMessage = true;
                setTimeout(() => this.showSuccessMessage = false, 2000);
            } else {
                // update
                this.spendingService.updateSpending(this.mForm.value);
            }
            this.submitted = false;
            this.mForm.reset();
        }
    }

    editSpending(spending) {
        console.log('spending', spending);
        this.mForm.setValue({
            $key: spending.$key,
            title: spending.title,
            cost: spending.cost
        });
    }

    onDelete(key) {
        if (confirm('Are you sure to delete spending?')) {
            this.spendingService.deleteSpending(key);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
