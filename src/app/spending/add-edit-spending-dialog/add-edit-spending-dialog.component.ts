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
    spendingForm = this.fb.group({
        $key: [null],
        title: [null, [Validators.required, Validators.minLength(3)]],
        cost: [null, Validators.required],
        category: [null]
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

              if (this.passedData) {
                  console.log('passedData', this.passedData);
                  console.log('categoriesList', this.categoriesList);
                  if (this.categoriesList.find(c => c.title === this.passedData.category)) {
                      console.log('>>>', this.categoriesList.find(c => c.title === this.passedData.category).$key);
                  }
                  this.spendingForm.setValue({
                      $key: this.passedData.$key,
                      title: this.passedData.title,
                      cost: this.passedData.cost,
                      category: this.categoriesList.find(c => c.title === this.passedData.category) ?
                          this.categoriesList.find(c => c.title === this.passedData.category).$key : null
                  });
              }
          }));
  }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}
