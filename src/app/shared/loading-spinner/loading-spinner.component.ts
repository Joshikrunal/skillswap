import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-wrap">
      <div class="spinner"></div>
    </div>
  `
})
export class LoadingSpinnerComponent {}
