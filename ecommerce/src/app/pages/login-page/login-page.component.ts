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
import { RouteEnum } from '../../enums/route.enum';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  error = '';
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private auth: AuthService, private router: Router) {}

  routeEnum = RouteEnum;

  submit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      this.auth.login(email!, password!).subscribe({
        next: (user) => this.next(user),
        error: () => (this.error = 'Invalid email or password'),
      });
    }
  }

  next(user: any) {
    console.log(user);
    this.router.navigate(['/']);
  }
}
