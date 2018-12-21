import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../../categories/categories.service';

@Component({
  selector: 'app-add-edit-spending-dialog',
  templateUrl: './add-edit-spending-dialog.component.html',
  styleUrls: ['./add-edit-spending-dialog.component.scss']
})
export class AddEditSpendingDialogComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    categoriesList = [];
    selected = 'option2';

    spendingForm = this.fb.group({
        $key: [null],
        title: [null, [Validators.required, Validators.minLength(3)]],
        cost: [null, Validators.required],
        category: [null, Validators.required]
    });

  constructor(
      private fb: FormBuilder,
      private categoriesService: CategoriesService,
      @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  ngOnInit() {
      this.subscriptions.push(this.categoriesService.getCategories()
          .subscribe(list => {
              this.categoriesList = list.map(category => {
                  return {
                      $key: category.key,
                      ...category.payload.val()
                  };
              });

              console.log('categoriesList', this.categoriesList);
          }));

    if (this.passedData) {
        this.spendingForm.setValue({
            $key: this.passedData.$key,
            title: this.passedData.title,
            cost: this.passedData.cost,
            category: this.passedData.category
        });
    }
  }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
