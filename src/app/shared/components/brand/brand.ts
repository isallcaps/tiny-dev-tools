import {Component, input} from '@angular/core';

@Component({
	selector: 'app-brand',
	template: `
		<span [class]="'brand-container ' + customClass()">
			<span class="text-primary fw-bold">&lt;</span>
			<span class="fw-semibold text-body">TinyDevTools</span>
			<span class="text-primary fw-bold">/&gt;</span>
		</span>
	`,
	styles: `
      .brand-container {
        white-space: nowrap;
        letter-spacing: -0.01em;
      }
	`
})
export class BrandComponent {
	customClass = input<string>('');
}