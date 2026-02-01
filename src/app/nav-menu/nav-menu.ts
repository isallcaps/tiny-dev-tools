import {Component, inject, TemplateRef} from '@angular/core';
import {NgbOffcanvas, NgbOffcanvasModule} from '@ng-bootstrap/ng-bootstrap';
import {Tool, TOOLS} from '../shared/constants/tools.constants';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
	selector: 'app-nav-menu',
	imports: [
		RouterLink,
		RouterLinkActive,
		NgbOffcanvasModule
	],
	template: `
		<!-- Hamburger button -->
		<button
				type="button"
				class="btn btn-outline-secondary d-inline-flex align-items-center gap-1"
				(click)="open(menu)"
				aria-label="Open tool menu">
			<!-- Simple icon: three lines -->
			<span class="d-inline-block" style="line-height: 0;">
				&#9776;
			</span>
			<span class="d-none d-sm-inline">Tools</span>
		</button>


		<ng-template #menu let-offcanvas>
			<div class="offcanvas-header">
				<h4 class="offcanvas-title" id="offcanvas-basic-title">Tiny Dev Tools</h4>
				<button type="button" class="btn-close" aria-label="Close"
						(click)="offcanvas.dismiss('Cross click')"></button>
			</div>
			<div class="offcanvas-body">
				<p class="text-muted small">
					Little tools for very specific front-end annoyances.
				</p>

				<ul class="list-unstyled mt-3 mb-0">
					@for (tool of tools; track tool.id) {
						<li class="mb-2">
							<a
									[routerLink]="['/', tool.path]"
									routerLinkActive="fw-semibold"
									class="text-decoration-none d-block py-1"
									(click)="offcanvas.close('Tool')">
								{{ tool.title }}
							</a>
						</li>
					}
				</ul>
			</div>
		</ng-template>



	`,
	styles: ``,
})
export class NavMenu {
	private readonly offcanvasService = inject(NgbOffcanvas);

	readonly tools:readonly Tool[] = TOOLS.filter((t) => !t.disabled);

	open(content:TemplateRef<unknown>) {
		this.offcanvasService.open(content, {
			position: 'start', // left side
			panelClass: 'border-end',
		});
	}
}
