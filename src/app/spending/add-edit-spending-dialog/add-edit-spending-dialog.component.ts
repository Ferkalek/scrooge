import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-spending-dialog',
  templateUrl: './add-edit-spending-dialog.component.html',
  styleUrls: ['./add-edit-spending-dialog.component.scss']
})
export class AddEditSpendingDialogComponent implements OnInit {
    spendingForm = this.fb.group({
        $key: [null],
        title: [null, [Validators.required, Validators.minLength(3)]],
        cost: [null, Validators.required],
    });

  constructor(
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public passedData: any
  ) { }

  ngOnInit() {
    console.log('dialog on init', this.passedData);
    if (this.passedData) {
        this.spendingForm.setValue({
            $key: this.passedData.$key,
            title: this.passedData.title,
            cost: this.passedData.cost
        });
    }
  }

}
