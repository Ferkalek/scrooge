import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

export class PasswordValidator {
    static passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
        if (form) {
            if (form.get('password').value !== form.get('password2').value) {
                return { notMatching: true };
            }
        }
        return null;
    }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
    signupForm: FormGroup;
    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.signupForm = new FormGroup({
            'email': new FormControl('', [
                Validators.required,
                Validators.email
            ]),
            'password': new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ]),
            'password2': new FormControl(null, [
                Validators.required,
                Validators.minLength(6)
            ]),
            'agree': new FormControl(false, [Validators.requiredTrue]),
        },(f: FormGroup) => PasswordValidator.passwordMatchValidator(f));
    }

    onSignup() {
        const {email, password} = this.signupForm.value;

        this.authService.registrUser({email, password});
    }
}
