import {Component, inject, OnInit} from '@angular/core';
import {LoremIpsum} from './lorem-ipsum';
import {FormsModule} from '@angular/forms';
import {NgbDropdown, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {CopyToClipboardBtn} from '../shared/components/copy-to-clipboard-btn/copy-to-clipboard-btn';
import {LOREM_BUT_EXACT_TOOL} from '../shared/constants/tools.constants';


@Component({
	selector: 'app-lorem-but-exact',
	imports: [
		FormsModule,
		NgbDropdownToggle,
		NgbDropdown,
		NgbDropdownMenu,
		NgbDropdownItem,
		CopyToClipboardBtn
	],
	template: `

		<div class="container py-4">
			<header class="mb-4">
				<h1 class="fw-bold">{{ tool.title }}</h1>

				@if (tool.description) {
					<p class="text-muted">
						{{ tool.description }}
					</p>
				}
			</header>

			<!-- Tool UI goes here -->
			<section>
				<div class="row">
					<div class="col-2">
						<div class="mb-3">
							<label for="input-number" class="form-label">Number</label>
							<div class="input-group">
								<input type="number" class="form-control" aria-label="Enter Number" id="input-number"
									   [(ngModel)]="characterLimit" min="0"
									   (ngModelChange)="generateOutput()">

								<div ngbDropdown class="d-inline-block">
									<button class="btn btn-primary dropdown-toggle dropdown-toggle-split" type="button"
											id="numberOptions"
											ngbDropdownToggle>
										<span class="visually-hidden">Toggle Dropdown</span>
									</button>

									<div ngbDropdownMenu aria-labelledby="dropdownBasic1"
										 class="dropdown-menu dropdown-menu-end">
										@for (item of characterLimits; track item) {
											<button ngbDropdownItem (click)="characterLimit = item; generateOutput()">{{ item }}
											</button>
										}
									</div>
								</div>
							</div>
						</div>


						<div class="mb-3">
							<label for="prefix" class="form-label">Prefix</label>
							<input type="text" class="form-control" id="prefix" [(ngModel)]="prefix"
								   (ngModelChange)="generateOutput()">
						</div>


						<div class="mb-3">
							<label for="suffix" class="form-label">Suffix</label>
							<input type="text" class="form-control" id="suffix" [(ngModel)]="suffix"
								   (ngModelChange)="generateOutput()">
						</div>
					</div>


					<div class="col">
						<textarea class="form-control" rows="20" id="output"
								  [maxLength]="characterLimit" [(ngModel)]="output">
						</textarea>

						<div class="mt-2 d-flex justify-content-end align-items-center">
							<span class="me-2">{{ output.length }} Characters</span>
							<app-copy-to-clipboard-btn [textToCopy]="output"></app-copy-to-clipboard-btn>
						</div>

					</div>
				</div>
			</section>
		</div>
	`,
	styles: `
      .dropdown-toggle {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
	`,
})
export class LoremButExact implements OnInit {
	readonly tool = LOREM_BUT_EXACT_TOOL;

	characterLimits:Array<number> = [
		250,
		256,
		2000,
		3500,
		4000,
		5000,
	];


	characterLimit:number = 250;
	output:string = '';
	prefix:string = '(Begin) - ';
	suffix:string = ' - (End)';

	private loremIpsum = inject(LoremIpsum);

	ngOnInit() {
		this.generateOutput();
	}

	generateOutput() {
		this.output = this.loremIpsum.generateWithPreAndSuffix(this.characterLimit, 'latin', this.prefix, this.suffix);
	}
}
