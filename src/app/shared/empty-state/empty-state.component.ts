import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="card empty-state">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'Nothing here';
  @Input() message = 'No data available.';
}
