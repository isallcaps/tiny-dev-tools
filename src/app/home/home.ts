import {Component} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Tool, TOOLS} from "../shared/constants/tools.constants";

@Component({
	selector: 'app-home',
	imports: [
		RouterLink
	],
	template: `
		<div class="container py-5">
			<div class="row mb-5">
				<div class="col text-center">
					<h1 class="fw-bold">Tiny Dev Tools</h1>
					<p class="text-muted fs-5">
						Little tools for very specific front-end annoyances.
					</p>
				</div>
			</div>

			<div class="row g-4">
				@for (tool of tools; track tool.id) {
					<div class="col-12 col-md-6 col-lg-4">
						<div class="card h-100 shadow-sm"
							 [class.opacity-50]="tool.disabled">
							<div class="card-body d-flex flex-column">
								<h5 class="card-title">{{ tool.title }}</h5>

								@if (tool.description) {
									<p class="card-text text-muted">
										{{ tool.description }}
									</p>
								}

								@if (!tool.disabled) {
									<a [routerLink]="['/', tool.path]"
									   class="btn btn-outline-primary mt-auto align-self-start">
										Open tool →
									</a>
								} @else {
									<span class="text-muted mt-auto">
										Coming soon
									</span>
								}
							</div>
						</div>
					</div>
				}
			</div>
		</div>

	`,
	styles: ``,
})
export class Home {
	readonly tools: readonly Tool[] = TOOLS;
}
