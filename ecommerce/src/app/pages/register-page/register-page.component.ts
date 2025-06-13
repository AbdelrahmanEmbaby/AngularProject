import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Gender } from '../../enums/gender.enum';
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  routeEnum = RouteEnum;
  error = '';

  form = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
    confirmPassword: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    gender: new FormControl<Gender | null>(null, [Validators.required]),
    profilePicture: new FormControl<string | null>(null),
    phoneNumber: new FormControl<string | null>(null),
    birthDate: new FormControl<Date | null>(null),
    address: new FormControl<string | null>(null),
  });

  constructor(private auth: AuthService, private router: Router) {}

  validate(): boolean {
    return (
      this.form.valid &&
      this.form.value.password === this.form.value.confirmPassword
    );
  }

  submit() {
    if (this.validate()) {
      const {
        name,
        email,
        password,
        gender,
        profilePicture,
        phoneNumber,
        birthDate,
        address,
      } = this.form.value;

      this.auth
        .register({
          name: name!,
          email: email!,
          password: password!,
          gender: gender!,
          profilePicture: profilePicture ?? '',
          phoneNumber: phoneNumber ?? '',
          birthDate: birthDate ?? undefined,
          address: address ?? '',
          isDeleted: false,
          roles: ['user'],
        })
        .subscribe({
          next: () => this.router.navigate(['/']),
          error: () => (this.error = 'Registration failed'),
        });
    } else {
      this.error =
        'Please fill all required fields and make sure passwords match.';
    }
  }
}
