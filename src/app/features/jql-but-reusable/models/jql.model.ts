// jql.model.ts

/**
 * One row from the JQL configuration CSV.
 *
 * Example:
 *   jiraField: "labels"
 *   jiraValue: "frontend"
 *   description: "All things UI"
 *   group: "UI Screens"
 */
export interface JqlConfigRow {
	jiraField:string;
	jiraValue:string;
	description?:string;
	group?:string;
}

/**
 * All rows belonging to a single Jira field (e.g. "labels", "project").
 *
 * - `ungrouped`: rows with no `group` value in the CSV
 * - `groups`: rows grouped by the CSV `group` column
 */
export interface GroupedFieldConfig {
	/** Rows that do NOT belong to any explicit group. */
	ungrouped:JqlConfigRow[];

	/** Explicit groups defined by the CSV `group` column. */
	groups:{
		[groupName:string]:JqlConfigRow[];
	};
}

/**
 * All Jira fields in the configuration, keyed by `jiraField`.
 *
 * Example keys:
 *   - "project"
 *   - "component"
 *   - "Epic Link"
 *   - "labels"
 */
export interface GroupedJqlConfig {
	[field:string]:GroupedFieldConfig;
}

/**
 * Checkbox selection state for all fields.
 *
 * Example:
 * {
 *   labels: {
 *     frontend: true,
 *     cleanup: false
 *   },
 *   project: {
 *     DEV: true
 *   }
 * }
 */
export interface SelectionMap {
	[field:string]:{
		[jiraValue:string]:boolean;
	};
}
