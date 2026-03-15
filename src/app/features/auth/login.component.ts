import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <form class="card auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h2>Welcome back</h2>
        <p class="muted">Login to continue your SkillSwap workflow.</p>

        <label>Email</label>
        <input type="email" formControlName="email" placeholder="Enter email" />

        <label>Password</label>
        <input type="password" formControlName="password" placeholder="Enter password" />

        @if (errorMessage) {
          <div class="alert error">{{ errorMessage }}</div>
        }

        <button class="btn w-full mt-16" [disabled]="form.invalid || loading">
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>

        <p class="muted mt-16">
          No account?
          <a routerLink="/register" style="color:#93c5fd">Create one</a>
        </p>
      </form>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Login successful', 'success');
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Login failed';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
