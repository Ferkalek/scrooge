import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

import { WelcomeComponent } from './welcome/welcome.component';
import { SpendingComponent } from './spending/spending.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { HistoryComponent } from "./history/history.component";
import { CategoriesComponent } from "./categories/categories.component";
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    // { path: 'main', component: SpendingComponent },
    { path: 'main', component: SpendingComponent, canActivate: [AuthGuard] },
    { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: RegistrationComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}
