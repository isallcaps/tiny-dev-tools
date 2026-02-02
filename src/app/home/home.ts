import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Tool, TOOLS} from '../core/constants/tools.constants';
import {NgClass} from '@angular/common';
import {BrandComponent} from '../shared/components/brand/brand';

@Component({
	selector: 'app-home',
	imports: [RouterLink, NgClass, BrandComponent],
	template: `
		<div class="container py-5">
			<div class="row mb-5 py-4">
				<div class="col text-center">
					<app-brand customClass="display-3 mb-3"></app-brand>
					<p class="text-body-secondary fs-5 mx-auto" style="max-width: 600px;">
						Small, opinionated utilities built to solve specific front-end annoyances without the feature creep.
					</p>
				</div>
			</div>

			<div class="row g-4">
				@for (tool of tools; track tool.id) {
					<div class="col-12 col-md-6 col-lg-4">
						<div class="tool-card h-100 p-4 rounded-4 border transition-all"
							 [ngClass]="{'opacity-75 grayscale': tool.disabled, 'bg-body-tertiary': !tool.disabled}">

							<div class="d-flex flex-column h-100">
								<div class="d-flex justify-content-between align-items-start mb-3">
									<h4 class="h5 fw-bold mb-0 text-body">{{ tool.title }}</h4>
									@if (tool.disabled) {
										<span class="badge rounded-pill text-bg-secondary-subtle text-secondary small">Soon</span>
									}
								</div>

								@if (tool.description) {
									<p class="text-body-secondary mb-4 flex-grow-1">
										{{ tool.description }}
									</p>
								}

								@if (!tool.disabled) {
									<a [routerLink]="['/', tool.path]"
									   class="btn btn-primary rounded-pill px-4 align-self-start">
										Open tool
									</a>
								}
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	`,
	styles: `
      .tool-card {
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        border-color: var(--bs-border-color);
      }

      .tool-card:hover:not(.opacity-75) {
        transform: translateY(-4px);
        border-color: var(--bs-primary-border-subtle);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
      }

      .grayscale {
        filter: grayscale(1);
      }
	`,
})
export class Home {
	readonly tools:readonly Tool[] = TOOLS;
}