import {Component, computed, input, model} from '@angular/core';

@Component({
	selector: 'app-jql-value-checkbox',
	standalone: true,
	template: `
		<div class="form-check">
			<input type="checkbox"
				   class="form-check-input"
				   [id]="inputId()"
				   [checked]="checked()"
				   (change)="onChange($event)"/>

			<label class="form-check-label" [for]="inputId()">
				<span class="fw-bold font-monospace">{{ value() }}</span>
				@if (description()) {
					<span class="fw-light text-secondary"> - {{ description() }}</span>
				}
			</label>
		</div>
	`,
})
export class JqlValueCheckbox {
	field = input.required<string>();
	value = input.required<string>();
	groupName = input<string | undefined>();
	description = input<string | undefined>();
	checked = model(false);

	inputId = computed(() => {
		const group = this.groupName();
		return group
			? `cb_${this.field()}_${group}_${this.value()}`
			: `cb_${this.field()}_${this.value()}`;
	});

	onChange(event:Event):void {
		const isChecked = (event.target as HTMLInputElement).checked;
		// Simply update the signal. Angular handles the emission to the parent!
		this.checked.set(isChecked);
	}
}