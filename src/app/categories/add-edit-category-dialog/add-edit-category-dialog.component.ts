import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-category-dialog',
  templateUrl: './add-edit-category-dialog.component.html'
})
export class AddEditCategoryDialogComponent implements OnInit {
    categoryForm = this.fb.group({
        $key: [null],
        title: [null, [Validators.required, Validators.minLength(3)]]
    });

  constructor(
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  ngOnInit() {
    if (this.passedData) {
        this.categoryForm.setValue({
            $key: this.passedData.$key,
            title: this.passedData.title
        });
    }
  }
}
