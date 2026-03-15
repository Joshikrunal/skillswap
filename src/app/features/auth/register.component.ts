import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <form class="card auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Create account</h2>
        <p class="muted">Join as a client or freelancer.</p>

        <label>Name</label>
        <input formControlName="name" />

        @if (submitted && form.controls.name.invalid) {
          <div class="alert error">Name is required.</div>
        }

        <label>Username</label>
        <input formControlName="username" />

        @if (submitted && form.controls.username.invalid) {
          <div class="alert error">Username is required.</div>
        }

        <label>Email</label>
        <input type="email" formControlName="email" />

        @if (submitted && form.controls.email.errors?.['required']) {
          <div class="alert error">Email is required.</div>
        }

        @if (submitted && form.controls.email.errors?.['email']) {
          <div class="alert error">Enter a valid email address.</div>
        }

        <label>Password</label>
        <input type="password" formControlName="password" />

        @if (submitted && form.controls.password.errors?.['required']) {
          <div class="alert error">Password is required.</div>
        }

        @if (submitted && form.controls.password.errors?.['minlength']) {
          <div class="alert error">Password must be at least 8 characters.</div>
        }

        @if (submitted && form.controls.password.errors?.['pattern']) {
          <div class="alert error">
            Password must contain at least 1 uppercase letter, 1 lowercase letter,
            1 number, and 1 special character.
          </div>
        }

        <label>Confirm Password</label>
        <input type="password" formControlName="confirmPassword" />

        @if (submitted && form.controls.confirmPassword.errors?.['required']) {
          <div class="alert error">Confirm Password is required.</div>
        }

        @if (submitted && form.errors?.['passwordMismatch']) {
          <div class="alert error">Password and Confirm Password do not match.</div>
        }

        <label>Bio</label>
        <textarea rows="3" formControlName="bio"></textarea>

        @if (submitted && form.controls.bio.invalid) {
          <div class="alert error">Bio is required.</div>
        }

        <label>Skills (comma separated)</label>
        <input formControlName="skills" placeholder="Angular, UI Design, Node.js" />

        @if (submitted && form.controls.skills.invalid) {
          <div class="alert error">Skills are required.</div>
        }

        @if (suggestedUsername) {
          <div class="alert info">
            Suggested username: <strong>{{ suggestedUsername }}</strong>
          </div>
        }

        @if (errorMessage) {
          <div class="alert error">{{ errorMessage }}</div>
        }

        <button class="btn w-full mt-16" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>

        <p class="muted mt-16">
          Already registered?
          <a routerLink="/login" style="color:#93c5fd">Login</a>
        </p>
      </form>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  errorMessage = '';
  suggestedUsername = '';
  submitted = false;

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\/[\];'`~+=]).+$/)
        ]
      ],
      confirmPassword: ['', Validators.required],
      bio: ['', Validators.required],
      skills: ['', Validators.required]
    },
    { validators: passwordMatchValidator() }
  );

  submit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.suggestedUsername = '';

    const raw = this.form.getRawValue();

    const payload = {
      name: raw.name,
      username: raw.username,
      email: raw.email,
      password: raw.password,
      bio: raw.bio,
      skills: raw.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.toast.show('Registration successful. Please login.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Registration failed';
        this.suggestedUsername = err?.error?.suggested_username || '';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}