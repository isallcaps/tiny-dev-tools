import {Component} from '@angular/core';
import {PageLinks} from "../shared/constants/page-links.constants";
import {RouterLink} from "@angular/router";

@Component({
	selector: 'app-home',
	imports: [
		RouterLink
	],
	template: `
		<h2 class="mb-3">Some tools to make dev easier.</h2>

		<div class="list-group">
			@for (link of links; track link.path) {
				<a class="list-group-item list-group-item-action" [routerLink]="link.path">
					<span class="fw-bold">{{ link.title }}</span>
					@if (link.description) {
						<span class="ps-3 fw-light fst-italic">{{ link.description }}</span>
					}
				</a>
			}
		</div>

	`,
	styles: ``,
})
export class Home {
	protected readonly links = PageLinks.List;
}
