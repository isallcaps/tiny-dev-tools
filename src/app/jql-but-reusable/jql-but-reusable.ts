import {JQL_BUT_REUSABLE_TOOL} from '../core/constants/tools.constants';
import {ToolLayout} from '../shared/components/tool-layout/tool-layout';
import {CopyToClipboardBtn} from '../shared/components/copy-to-clipboard-btn/copy-to-clipboard-btn';
import {FormsModule} from '@angular/forms';
import {GroupedJqlConfig, SelectionMap} from './models/jql.model';
import {buildJqlFromSelection, groupRows, parseJqlCsv} from './utils/jql.utils';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {FieldSelectionChange, GroupColumnComponent} from './components/jql-group-columns/jql-group-columns';
import {Component, OnInit, signal, computed, effect, inject, DestroyRef} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {readFileAsText} from '../shared/utils/file-reader.utils';
import {DragAndDrop} from '../shared/directives/drag-and-drop';

const LOCAL_STORAGE_ROWS_KEY = 'tiny-dev-tools:jql-config-rows';
const LOCAL_STORAGE_SELECTIONS_KEY = 'tiny-dev-tools:jql-selections';


@Component({
	selector: 'app-jql-but-reusable',
	standalone: true,
	imports: [ToolLayout,
		CopyToClipboardBtn,
		FormsModule,
		NgbNavModule,
		GroupColumnComponent, DragAndDrop],
	templateUrl: 'jql-but-reusable.html',
})
export class JqlButReusable implements OnInit {
	readonly tool = JQL_BUT_REUSABLE_TOOL;

	// --- Signals replace standard properties ---
	csvInput = signal('');
	csvFileName = signal('');
	grouped = signal<GroupedJqlConfig>({});
	selections = signal<SelectionMap>({});
	manualQuery = signal(''); // Bound to textarea
	activeTab = signal<'config' | 'query'>('config');

	// --- Computed State ---

	/** Replaces get fieldKeys() */
	fieldKeys = computed(() => Object.keys(this.grouped()));

	/** Replaces get jql() - Memoized JQL generation */
	generatedJql = computed(() => buildJqlFromSelection(this.grouped(), this.selections()));

	private destroyRef = inject(DestroyRef);

	constructor() {
		/** * LocalStorage Auto-Sync:
		 * This effect runs whenever selections or grouped change.
		 */
		effect(() => {
			const currentSelections = this.selections();
			if (Object.keys(currentSelections).length) {
				localStorage.setItem(LOCAL_STORAGE_SELECTIONS_KEY, JSON.stringify(currentSelections));
			}
		});
	}

	ngOnInit():void {
		this.loadFromLocalStorage();
	}

	onFileDropped(file:File):void {
		this.csvFileName.set(file.name);

		readFileAsText(file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (content) => {
					this.csvInput.set(content);
					// this.onApplyCsv(); // Optional: Auto-apply on drop
				},
				error: (err) => {
					console.error(err);
					this.csvFileName.set('Error loading file');
				}
			});
	}


	onFileSelected(event:Event):void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (!file) return;

		this.csvFileName.set(file.name);

		readFileAsText(file)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: (content) => {
					this.csvInput.set(content);
					// Optional: Automatically trigger the apply logic
					// this.onApplyCsv();
				},
				error: (err) => {
					console.error(err);
					this.csvFileName.set('Error loading file');
				}
			});
	}

	/** * Whenever the generated JQL changes, we want to update the manual query
	 * unless the user is actively typing in the query tab.
	 */
	private updateManualQuery() {
		this.manualQuery.set(this.generatedJql());
	}

	onApplyCsv():void {
		const rows = parseJqlCsv(this.csvInput());

		if (!rows.length) {
			this.clearLocalConfig();
			return;
		}

		const newGrouped = groupRows(rows);
		this.grouped.set(newGrouped);

		// Initialize selections based on new config
		const newSelections = this.createInitialSelections(newGrouped);
		this.selections.set(newSelections);

		localStorage.setItem(LOCAL_STORAGE_ROWS_KEY, JSON.stringify(rows));

		this.updateManualQuery();
		this.activeTab.set('query');
	}

	onFieldSelectionChange(evt:FieldSelectionChange):void {
		// Update selection signal immutably to trigger reactivity
		this.selections.update(prev => {
			const updatedField = {...prev[evt.field], [evt.value]: evt.checked};
			return {...prev, [evt.field]: updatedField};
		});

		this.updateManualQuery();
	}

	loadFromLocalStorage():void {
		try {
			const storedRows = localStorage.getItem(LOCAL_STORAGE_ROWS_KEY);
			if (!storedRows) return;

			const rows = JSON.parse(storedRows);
			const groupedData = groupRows(rows);
			this.grouped.set(groupedData);

			const storedSelections = localStorage.getItem(LOCAL_STORAGE_SELECTIONS_KEY);
			if (storedSelections) {
				this.selections.set(JSON.parse(storedSelections));
			}
			else {
				this.selections.set(this.createInitialSelections(groupedData));
			}

			this.updateManualQuery();
			if (this.fieldKeys().length) this.activeTab.set('query');
		} catch (e) {
			console.warn('Failed to load JQL config', e);
		}
	}

	private createInitialSelections(config:GroupedJqlConfig):SelectionMap {
		const selections:SelectionMap = {};
		for (const field of Object.keys(config)) {
			selections[field] = {};
			const fieldConfig = config[field];
			[...(fieldConfig.ungrouped || []), ...Object.values(fieldConfig.groups || []).flat()]
				.forEach(row => selections[field][row.jiraValue] = false);
		}
		return selections;
	}

	clearLocalConfig():void {
		this.grouped.set({});
		this.selections.set({});
		this.csvInput.set('');
		this.csvFileName.set('');
		this.manualQuery.set('');
		localStorage.removeItem(LOCAL_STORAGE_ROWS_KEY);
		localStorage.removeItem(LOCAL_STORAGE_SELECTIONS_KEY);
		this.activeTab.set('config');
	}

	resetQuery():void {
		this.updateManualQuery();
	}


	loadSampleCsv():void {
		if (this.csvInput().trim()) {
			const ok = confirm('Replace the current CSV with a sample?');
			if (!ok) {
				return;
			}
		}

		this.csvFileName.set('sample-jira-config.csv');
		this.csvInput.set(`jiraField,jiraValue,description,group
project,DEV,Main dev project,
component,Core,Shared core logic,
component,UI,User-facing stuff,
"Epic Link",DEV-42,The big thing we’re working on,
labels,cleanup,Tech debt nobody loves,
labels,frontend,All things UI,
labels,home,Home screen,UI Screens
labels,settings,Settings screen,UI Screens
`);
	}
}