import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { SpendingService } from './spending/spending.service';
import { MaterialModule } from "./shared/material.module";

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SpendingComponent } from './spending/spending.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { StorageService } from './shared/services/storage.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NotFoundComponent,
    SpendingComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    SpendingService,
    AuthService,
    AuthGuard,
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
