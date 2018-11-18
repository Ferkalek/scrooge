import { NgModule } from "@angular/core";

import {
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,

} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,

    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,

    ]
})
export class MaterialModule {}
