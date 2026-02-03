import {Component, inject, TemplateRef} from '@angular/core';
import {NgbOffcanvas, NgbOffcanvasModule} from '@ng-bootstrap/ng-bootstrap';
import {Tool, TOOLS} from '@constants';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {BrandComponent} from '@shared';

@Component({
	selector: 'app-nav-menu',
	standalone: true,
	imports: [
		RouterLink,
		RouterLinkActive,
		NgbOffcanvasModule,
		BrandComponent
	],
	template: `
		<button type="button"
				class="btn btn-link text-body p-2 border-0 me-1"
				(click)="open(menu)"
				aria-label="Open navigation menu">
			<i class="bi bi-list fs-4"></i>
		</button>

		<ng-template #menu let-offcanvas>
			<div class="offcanvas-header border-bottom">
				<h5 class="offcanvas-title" id="offcanvas-basic-title">
					<app-brand></app-brand>
				</h5>
				<button type="button" class="btn-close text-reset" aria-label="Close"
						(click)="offcanvas.dismiss()"></button>
			</div>

			<div class="offcanvas-body p-0">
				<div class="px-3 py-3">
					<p class="text-body-secondary small mb-0">
						Small, opinionated utilities for dev annoyances.
					</p>
				</div>

				<nav class="nav-drawer-list">
					@for (tool of tools; track tool.id) {
						<a
								[routerLink]="['/', tool.path]"
								routerLinkActive="active"
								class="nav-item d-flex align-items-center px-3 py-2 text-decoration-none"
								(click)="offcanvas.close()">
							<i class="bi bi-chevron-right small me-3 opacity-50"></i>
							<span class="nav-label">{{ tool.title }}</span>
						</a>
					}
				</nav>
			</div>
		</ng-template>
	`,
	styles: `
      .nav-drawer-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 0 8px;
      }

      .nav-item {
        color: var(--bs-body-color);
        border-radius: 0 24px 24px 0; /* Google's modern drawer pill shape */
        margin-right: 8px;
        transition: all 0.2s ease;
        font-size: 0.95rem;
      }

      .nav-item:hover {
        background-color: var(--bs-tertiary-bg);
      }

      /* The Active State: Google Blue pill */
      .nav-item.active {
        background-color: var(--bs-primary-bg-subtle);
        color: var(--bs-primary-text-emphasis);
        font-weight: 600;

        i {
          color: var(--bs-primary);
          opacity: 1 !important;
        }
      }
	`,
})
export class NavMenu {
	private readonly offcanvasService = inject(NgbOffcanvas);

	// Using a readonly array for the signal-ready data
	readonly tools:readonly Tool[] = TOOLS.filter((t) => !t.disabled);

	open(content:TemplateRef<unknown>) {
		this.offcanvasService.open(content, {
			position: 'start',
			panelClass: 'border-end bg-body', // Ensures it respects the theme background
			scroll: true
		});
	}
}