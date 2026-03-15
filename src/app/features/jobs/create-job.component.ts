import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobsService } from '../../core/services/jobs.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-create-job',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form class="card form-card" [formGroup]="form" (ngSubmit)="submit()">
      <h2>Create New Job</h2>
      <p class="muted">Post a new project for freelancers.</p>

      <label>Title</label>
      <input formControlName="title" />

      <label>Description</label>
      <textarea rows="5" formControlName="description"></textarea>

      <label>Budget</label>
      <input type="number" formControlName="budget" />

      <label>Category</label>
      <input formControlName="category" />

      @if (errorMessage) {
        <div class="alert error">{{ errorMessage }}</div>
      }

      <button class="btn w-full mt-16" [disabled]="form.invalid || loading">
        {{ loading ? 'Creating Job...' : 'Create Job' }}
      </button>
    </form>
  `
})
export class CreateJobComponent {
  private fb = inject(FormBuilder);
  private jobsService = inject(JobsService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    budget: [0, [Validators.required, Validators.min(1)]],
    category: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    this.jobsService.createJob(this.form.getRawValue()).subscribe({
      next: () => {
        this.toast.show('Job created successfully', 'success');
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.error || 'Could not create job';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}