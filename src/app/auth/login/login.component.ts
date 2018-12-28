import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  constructor(
      private authService: AuthService
  ) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
      this.authService.login(form.value);
  }

}
