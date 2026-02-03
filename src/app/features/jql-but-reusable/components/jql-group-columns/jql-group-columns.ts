import {Component, computed, input, output} from '@angular/core';
import {GroupedFieldConfig} from '../../models/jql.model';
import {JqlValueCheckbox} from '../jql-value-checkbox/jql-value-checkbox';

export interface FieldSelectionChange {
	field:string;
	value:string;
	checked:boolean;
}

@Component({
	selector: 'app-jql-group-columns',
	standalone: true,
	imports: [JqlValueCheckbox],
	template: `
		<div class="row g-4">
			@if (fieldConfig().ungrouped?.length) {
				<div class="col-12 col-md-6 col-lg-4">
					@if (hasGroups()) {
						<div class="mb-2 d-flex align-items-center gap-2 text-body-secondary small fw-bold">
							<i class="bi bi-collection-fill opacity-50"></i>
							<span class="text-uppercase tracking-wider">{{ ungroupedLabel }}</span>
							<span class="badge rounded-pill bg-body-secondary text-body-secondary border px-2">
                  {{ fieldConfig().ungrouped.length }}
               </span>
						</div>
					}

					<div class="checkbox-group-container">
						@for (item of fieldConfig().ungrouped; track item.jiraValue) {
							<app-jql-value-checkbox
									[field]="field()"
									[value]="item.jiraValue"
									[description]="item.description"
									[checked]="isSelected(item.jiraValue)"
									(checkedChange)="onCheckboxChange(item.jiraValue, $event)">
							</app-jql-value-checkbox>
						}
					</div>
				</div>
			}

			@for (groupName of groupNames(); track groupName) {
				<div class="col-12 col-md-6 col-lg-4">
					<div class="mb-2 d-flex align-items-center gap-2 small fw-bold text-body">
						<i class="bi bi-folder-fill text-primary opacity-75"></i>
						<span class="text-uppercase tracking-wider">{{ groupName }}</span>
						<span class="badge rounded-pill bg-primary-subtle text-primary-emphasis border border-primary-subtle px-2">
               {{ fieldConfig().groups?.[groupName]?.length ?? 0 }}
            </span>
					</div>

					<div class="checkbox-group-container">
						@for (item of fieldConfig().groups?.[groupName] ?? []; track item.jiraValue) {
							<app-jql-value-checkbox
									[field]="field()"
									[groupName]="groupName"
									[value]="item.jiraValue"
									[description]="item.description"
									[checked]="isSelected(item.jiraValue)"
									(checkedChange)="onCheckboxChange(item.jiraValue, $event)">
							</app-jql-value-checkbox>
						}
					</div>
				</div>
			}
		</div>
	`
})
export class GroupColumnComponent {
	// Inputs as Signals
	field = input.required<string>();
	fieldConfig = input.required<GroupedFieldConfig>();

	selectionsForField = input<{ [value:string]:boolean }>({});

	// Modern Output
	selectionChange = output<FieldSelectionChange>();

	readonly ungroupedLabel = 'Everything Else';

	groupNames = computed(() => Object.keys(this.fieldConfig()?.groups ?? {}));

	hasGroups = computed(() => this.groupNames().length > 0);


	isSelected(value:string):boolean {
		return !!this.selectionsForField()[value];
	}

	onCheckboxChange(value:string, checked:boolean):void {
		this.selectionChange.emit({
			field: this.field(),
			value,
			checked,
		});
	}
}