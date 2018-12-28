import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { SpendingService } from './spending/spending.service';
import { CategoriesService } from './categories/categories.service';
import { MaterialModule } from './shared/material.module';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SpendingComponent } from './spending/spending.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { StorageService } from './shared/services/storage.service';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { AddEditSpendingDialogComponent } from './spending/add-edit-spending-dialog/add-edit-spending-dialog.component';
import { AddButtonComponent } from './shared/components/add-button/add-button.component';
import { AddEditCategoryDialogComponent } from './categories/add-edit-category-dialog/add-edit-category-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NotFoundComponent,
    SpendingComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    CategoriesComponent,
    AddEditSpendingDialogComponent,
    AddButtonComponent,
    AddEditCategoryDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    MaterialModule,
    NgxChartsModule
  ],
  providers: [
    SpendingService,
    CategoriesService,
    AuthService,
    AuthGuard,
    StorageService
  ],
  entryComponents: [
      AddEditSpendingDialogComponent,
      AddEditCategoryDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
