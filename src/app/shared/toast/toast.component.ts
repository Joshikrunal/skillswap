import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toastService.toast(); as toast) {
      <div class="toast" [class.success]="toast.type === 'success'" [class.error]="toast.type === 'error'" [class.info]="toast.type === 'info'">
        {{ toast.text }}
      </div>
    }
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
