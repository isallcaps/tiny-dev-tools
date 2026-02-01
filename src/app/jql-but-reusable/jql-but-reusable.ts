import {Component, OnInit} from '@angular/core';
import {JQL_BUT_REUSABLE_TOOL} from '../shared/constants/tools.constants';
import {ToolLayout} from '../shared/components/tool-layout/tool-layout';
import {CopyToClipboardBtn} from '../shared/components/copy-to-clipboard-btn/copy-to-clipboard-btn';
import {FormsModule} from '@angular/forms';
import {GroupedJqlConfig, SelectionMap} from '../shared/models/jql-config.model';
import {buildJqlFromSelection, groupRows, parseJqlCsv} from '../shared/utils/jql-utils';

const LOCAL_STORAGE_ROWS_KEY = 'tiny-dev-tools:jql-config-rows';
const LOCAL_STORAGE_SELECTIONS_KEY = 'tiny-dev-tools:jql-selections';


@Component({
	selector: 'app-jql-but-reusable',
	imports: [
		ToolLayout,
		CopyToClipboardBtn,
		FormsModule
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

	showConfig = true;

	ngOnInit():void {
		this.loadFromLocalStorage();
	}

	/** Field names, used for @for iteration */
	get fieldKeys():string[] {
		return Object.keys(this.grouped);
	}

	/** Group names for a given field */
	groupKeys(field:string):string[] {
		return Object.keys(this.grouped[field] ?? {});
	}

	/** Generated JQL string based on grouped config + selections */
	get jql():string {
		return buildJqlFromSelection(this.grouped, this.selections);
	}

	toggleConfig():void {
		this.showConfig = !this.showConfig;
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
		this.showConfig = false;
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
		} catch (e) {
			console.warn('Failed to load JQL config from localStorage', e);
		}
	}

	/* ---------- Selection helpers ---------- */

	private initSelectionsFromGrouped(defaultChecked = false):void {
		const selections:SelectionMap = {};

		for (const field of Object.keys(this.grouped)) {
			const fieldSelections:{ [jiraValue:string]:boolean } = {};
			const groups = this.grouped[field];

			for (const groupName of Object.keys(groups)) {
				for (const row of groups[groupName]) {
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
			if (!this.selections[field]) {
				this.selections[field] = {};
			}

			const groups = this.grouped[field];

			for (const groupName of Object.keys(groups)) {
				for (const row of groups[groupName]) {
					if (typeof this.selections[field][row.jiraValue] === 'undefined') {
						this.selections[field][row.jiraValue] = false;
					}
				}
			}
		}
	}

	isSelected(field:string, value:string):boolean {
		return !!this.selections[field]?.[value];
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

	/* ---------- New: Clear + Reset actions ---------- */

	/** Clears all local config + selections + query */
	clearLocalConfig():void {
		this.grouped = {};
		this.selections = {};
		this.csvInput = '';
		this.csvFileName = '';
		this.manualQuery = '';
		this.showConfig = true;
		localStorage.removeItem(LOCAL_STORAGE_ROWS_KEY);
		localStorage.removeItem(LOCAL_STORAGE_SELECTIONS_KEY);
	}

	/** Reset editable query back to the current generated JQL */
	resetQuery():void {
		this.manualQuery = this.jql;
	}
}
