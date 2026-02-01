import {Component, OnInit} from '@angular/core';
import {JQL_BUT_REUSABLE_TOOL} from '../core/constants/tools.constants';
import {ToolLayout} from '../shared/components/tool-layout/tool-layout';
import {CopyToClipboardBtn} from '../shared/components/copy-to-clipboard-btn/copy-to-clipboard-btn';
import {FormsModule} from '@angular/forms';
import {GroupedJqlConfig, SelectionMap} from './models/jql.model';
import {buildJqlFromSelection, groupRows, parseJqlCsv} from './utils/jql-utils';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {FieldSelectionChange, GroupColumnComponent} from './components/jql-group-columns/jql-group-columns';

const LOCAL_STORAGE_ROWS_KEY = 'tiny-dev-tools:jql-config-rows';
const LOCAL_STORAGE_SELECTIONS_KEY = 'tiny-dev-tools:jql-selections';


@Component({
	selector: 'app-jql-but-reusable',
	imports: [
		ToolLayout,
		CopyToClipboardBtn,
		FormsModule,
		NgbNavModule,
		GroupColumnComponent
	],
	templateUrl: 'jql-but-reusable.html',
	styles: ``,
})
export class JqlButReusable implements OnInit {

	readonly tool = JQL_BUT_REUSABLE_TOOL;

	// Raw CSV content (from paste or file upload)
	csvInput = '';
	csvFileName = '';

	// Grouped config and selections for the UI
	grouped:GroupedJqlConfig = {};
	selections:SelectionMap = {};

	// Editable query text bound to the textarea
	manualQuery = '';

	activeTab:'config' | 'query' = 'config';

	ngOnInit():void {
		this.loadFromLocalStorage();
	}

	/** Field names, used for @for iteration */
	get fieldKeys():string[] {
		return Object.keys(this.grouped);
	}

	/** Group names for a given field */
	groupKeys(field:string):string[] {
		return Object.keys(this.grouped[field]?.groups ?? {});
	}

	/** Generated JQL string based on grouped config + selections */
	get jql():string {
		return buildJqlFromSelection(this.grouped, this.selections);
	}

	/* ---------- File / CSV handling ---------- */

	onFileSelected(event:Event):void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		this.csvFileName = file.name;

		const reader = new FileReader();
		reader.onload = () => {
			this.csvInput = reader.result?.toString() ?? '';
		};
		reader.readAsText(file);
	}

	onApplyCsv():void {
		const rows = parseJqlCsv(this.csvInput);

		if (!rows.length) {
			// Clear everything if CSV is empty/invalid
			this.grouped = {};
			this.selections = {};
			this.manualQuery = '';
			this.csvFileName = '';

			localStorage.removeItem(LOCAL_STORAGE_ROWS_KEY);
			localStorage.removeItem(LOCAL_STORAGE_SELECTIONS_KEY);
			this.activeTab = 'config';
			return;
		}

		this.grouped = groupRows(rows);
		this.initSelectionsFromGrouped();

		localStorage.setItem(LOCAL_STORAGE_ROWS_KEY, JSON.stringify(rows));
		localStorage.setItem(
			LOCAL_STORAGE_SELECTIONS_KEY,
			JSON.stringify(this.selections),
		);

		// Start manual query from the generated one
		this.manualQuery = this.jql;
		this.activeTab = 'query';
	}

	loadSampleCsv():void {
		if (this.csvInput.trim()) {
			const ok = confirm('Replace the current CSV with a sample?');
			if (!ok) return;
		}

		this.csvFileName = 'sample-jira-config.csv';
		this.csvInput = `jiraField,jiraValue,description,group
project,DEV,Main dev project,
component,Core,Shared core logic,
component,UI,User-facing stuff,
"Epic Link",DEV-42,The big thing we’re working on,
labels,cleanup,Tech debt nobody loves,
labels,frontend,All things UI,
labels,home,Home screen,UI Screens
labels,settings,Settings screen,UI Screens
`;
	}


	loadFromLocalStorage():void {
		try {
			const storedRows = localStorage.getItem(LOCAL_STORAGE_ROWS_KEY);
			if (!storedRows) return;

			const rows = JSON.parse(storedRows);
			this.grouped = groupRows(rows);

			const storedSelections = localStorage.getItem(
				LOCAL_STORAGE_SELECTIONS_KEY,
			);
			if (storedSelections) {
				this.selections = JSON.parse(storedSelections) as SelectionMap;
			}
			else {
				this.initSelectionsFromGrouped();
			}

			this.ensureSelectionsCoverGrouped();

			// Initialize manual query from the generated one
			this.manualQuery = this.jql;
			if (Object.keys(this.grouped).length) {
				this.activeTab = 'query';
			}
		} catch (e) {
			console.warn('Failed to load JQL config from localStorage', e);
		}
	}

	/* ---------- Selection helpers ---------- */
	private initSelectionsFromGrouped(defaultChecked = false):void {
		const selections:SelectionMap = {};

		for (const field of Object.keys(this.grouped)) {
			const fieldConfig = this.grouped[field];
			const fieldSelections:{ [jiraValue:string]:boolean } = {};

			// Ungrouped
			for (const row of fieldConfig.ungrouped ?? []) {
				if (!(row.jiraValue in fieldSelections)) {
					fieldSelections[row.jiraValue] = defaultChecked;
				}
			}

			// Grouped
			for (const groupName of Object.keys(fieldConfig.groups ?? {})) {
				const rows = fieldConfig.groups[groupName] ?? [];
				for (const row of rows) {
					if (!(row.jiraValue in fieldSelections)) {
						fieldSelections[row.jiraValue] = defaultChecked;
					}
				}
			}

			selections[field] = fieldSelections;
		}

		this.selections = selections;
	}

	private ensureSelectionsCoverGrouped():void {
		for (const field of Object.keys(this.grouped)) {
			const fieldConfig = this.grouped[field];

			if (!this.selections[field]) {
				this.selections[field] = {};
			}

			const fieldSelections = this.selections[field];

			// Ungrouped
			for (const row of fieldConfig.ungrouped ?? []) {
				if (typeof fieldSelections[row.jiraValue] === 'undefined') {
					fieldSelections[row.jiraValue] = false;
				}
			}

			// Grouped
			for (const groupName of Object.keys(fieldConfig.groups ?? {})) {
				const rows = fieldConfig.groups[groupName] ?? [];
				for (const row of rows) {
					if (typeof fieldSelections[row.jiraValue] === 'undefined') {
						fieldSelections[row.jiraValue] = false;
					}
				}
			}
		}
	}

	onFieldSelectionChange(evt:FieldSelectionChange):void {
		this.toggleSelection(evt.field, evt.value, evt.checked);
	}

	toggleSelection(field:string, value:string, checked:boolean):void {
		if (!this.selections[field]) {
			this.selections[field] = {};
		}
		this.selections[field][value] = checked;

		localStorage.setItem(
			LOCAL_STORAGE_SELECTIONS_KEY,
			JSON.stringify(this.selections),
		);

		// Whenever structure/selection changes, reset manual query base
		this.manualQuery = this.jql;
	}

	/** Clears all local config + selections + query */
	clearLocalConfig():void {
		this.grouped = {};
		this.selections = {};
		this.csvInput = '';
		this.csvFileName = '';
		this.manualQuery = '';
		localStorage.removeItem(LOCAL_STORAGE_ROWS_KEY);
		localStorage.removeItem(LOCAL_STORAGE_SELECTIONS_KEY);
		this.activeTab = 'config';
	}

	/** Reset editable query back to the current generated JQL */
	resetQuery():void {
		this.manualQuery = this.jql;
	}
}
