import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    constructor(
      private authService: AuthService
    ) { }

    onRegistration(form: NgForm) {
      this.authService.registrUser({
          email: form.value.email,
          password: form.value.password
      });
    }
}
