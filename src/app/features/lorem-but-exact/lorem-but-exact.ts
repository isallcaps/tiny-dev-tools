import {Component, inject, signal, computed, linkedSignal} from '@angular/core';
import {LoremFlavor, LoremIpsum} from './services/lorem-ipsum';
import {FormsModule} from '@angular/forms';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {LOREM_BUT_EXACT_TOOL} from '@constants';
import {CopyToClipboardBtn, ToolLayout} from '@shared';
import {LoremStorage} from './services/lorem-storage';


@Component({
	selector: 'app-lorem-but-exact',
	imports: [
		FormsModule,
		NgbDropdownToggle,
		NgbDropdown,
		NgbDropdownMenu,
		NgbDropdownItem,
		CopyToClipboardBtn,
		ToolLayout
	],
	template: `
		<app-tool-layout [tool]="tool">
			<div class="row">
				<div class="col-md-2">
					<div class="mb-3">
						<label for="input-number" class="form-label">Character Limit</label>
						<div class="input-group">
							<input type="number" class="form-control" id="input-number"
								   [ngModel]="characterLimit()"
								   (ngModelChange)="characterLimit.set($event)" min="0">

							<button class="btn btn-outline-primary" type="button"
									(click)="loremStorage.addLimit(characterLimit())"
									title="Save to favorites">
								<i class="bi bi-bookmark-plus"></i>
							</button>

							<div ngbDropdown class="d-inline-block">
								<button class="btn btn-primary dropdown-toggle dropdown-toggle-split dropdown-toggle-end"
										type="button" ngbDropdownToggle>
								</button>
								<div ngbDropdownMenu class="dropdown-menu dropdown-menu-end">
									<h6 class="dropdown-header text-uppercase fw-bold small">Standards</h6>
									@for (item of defaultOptions; track item) {
										<button ngbDropdownItem (click)="characterLimit.set(item)">{{ item }}</button>
									}

									@if (loremStorage.customLimits().length > 0) {
										<div class="dropdown-divider"></div>
										<h6 class="dropdown-header text-uppercase fw-bold small text-primary">Your Favorites</h6>
										@for (item of loremStorage.customLimits(); track item) {
											<div class="d-flex align-items-center justify-content-between pe-2">
												<button ngbDropdownItem class="flex-grow-1" (click)="characterLimit.set(item)">
													{{ item }}
												</button>
												<button class="btn btn-link btn-sm text-danger p-0"
														(click)="loremStorage.removeLimit(item); $event.stopPropagation()">
													<i class="bi bi-x-lg"></i>
												</button>
											</div>
										}
									}
								</div>
							</div>
						</div>
					</div>

					<div class="mb-3">
						<label class="form-label">Dictionary Flavor</label>
						<select
								id="flavor-select"
								class="form-select"
								[ngModel]="flavor()"
								(ngModelChange)="flavor.set($event)">
							<option value="latin">Latin (Classic)</option>
							<option value="cupcake">Cupcake (Sweet)</option>
							<option value="pirate">Pirate (Arr!)</option>
						</select>
						<button class="btn btn-outline-primary btn-sm w-100 mt-2" (click)="randomize()">
							<i class="bi bi-shuffle"></i> Randomize Words
						</button>
					</div>
					<div class="mb-3">
						<label for="prefix" class="form-label">Prefix</label>
						<input type="text" class="form-control" id="prefix"
							   [ngModel]="prefix()" (ngModelChange)="prefix.set($event)">
					</div>

					<div class="mb-3">
						<label for="suffix" class="form-label">Suffix</label>
						<input type="text" class="form-control" id="suffix"
							   [ngModel]="suffix()" (ngModelChange)="suffix.set($event)">
					</div>
				</div>

				<div class="col">
                <textarea class="form-control tool-textarea" rows="20" id="output"
						  [maxLength]="characterLimit()"
						  [ngModel]="output()"
						  (ngModelChange)="output.set($event)">
                </textarea>

					<div class="mt-2 d-flex justify-content-end align-items-center">
						<span class="me-2 text-body-secondary small">{{ output().length }} / {{ characterLimit() }} Characters</span>
						<app-copy-to-clipboard-btn [textToCopy]="output()"></app-copy-to-clipboard-btn>
					</div>
				</div>
			</div>
		</app-tool-layout>

	`,
	styles: `
      .dropdown-toggle-end {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
	`,
})
export class LoremButExact {
	readonly tool = LOREM_BUT_EXACT_TOOL;

	private loremIpsum = inject(LoremIpsum);
	loremStorage = inject(LoremStorage);

	defaultOptions = [250, 256, 2000, 3500, 4000, 5000];

	// Signals
	characterLimit = signal(250);
	prefix = signal('(Begin) - ');
	suffix = signal(' - (End)');
	flavor = signal<LoremFlavor>('latin');
	refreshTrigger = signal(0);

	generatedText = computed(() => {
		// Calling the function registers this signal as a dependency
		this.refreshTrigger();

		return this.loremIpsum.generateWithPreAndSuffix(
			this.characterLimit(),
			this.flavor(),
			this.prefix(),
			this.suffix()
		);
	});

	characterLimitOptions = computed(() => {
		const custom = this.loremStorage.customLimits();
		return [...new Set([...this.defaultOptions, ...custom])].sort((a, b) => a - b);
	});

	output = linkedSignal(() => this.generatedText());

	randomize() {
		this.refreshTrigger.update(n => n + 1);
	}
}
