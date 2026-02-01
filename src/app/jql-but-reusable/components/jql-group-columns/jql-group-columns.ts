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
		<div class="row g-3">
			@if (!hasGroups()) {
				@if (fieldConfig().ungrouped?.length) {
					<div class="col-12 col-md-6 col-lg-4">
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
				}
			} @else {
				@if (fieldConfig().ungrouped?.length) {
					<div class="col-12 col-md-6 col-lg-4">
						<div class="mb-1 d-flex align-items-center gap-1 text-muted small">
							<i class="bi bi-list-ul"></i>
							<span>{{ ungroupedLabel }}</span>
							<span class="badge bg-secondary-subtle text-secondary">
                        {{ fieldConfig().ungrouped.length }}
                      </span>
						</div>

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
				}
			}

			@for (groupName of groupNames(); track groupName) {
				<div class="col-12 col-md-6 col-lg-4">
					<div class="mb-1 d-flex align-items-center gap-1 small fw-semibold">
						<i class="bi bi-folder2-open"></i>
						<span>{{ groupName }}</span>
						<span class="badge bg-primary-subtle text-primary">
                      {{ fieldConfig().groups?.[groupName]?.length ?? 0 }}
                   </span>
					</div>

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