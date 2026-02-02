import {Component, Input} from '@angular/core';
import {Tool} from '../../../core/constants/tools.constants';

@Component({
	selector: 'app-tool-layout',
	imports: [],
	template: `
		<div class="container py-4">
			<header class="mb-4">
				<h1 class="fw-bold">{{ tool.title }}</h1>

				@if (tool.description) {
					<p class="text-body-secondary">
						{{ tool.description }}
					</p>
				}
			</header>

			<section>
				<ng-content></ng-content>
			</section>
		</div>
	`,
	styles: ``,
})
export class ToolLayout {
	@Input({required: true}) tool!:Tool;
}
