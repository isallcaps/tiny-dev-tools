import * as Papa from 'papaparse';
import {
	GroupedJqlConfig,
	JqlConfigRow,
	SelectionMap,
} from '../models/jql.model';

/**
 * Parses CSV content using PapaParse to handle quotes and commas correctly.
 */
export function parseJqlCsv(csvContent:string):JqlConfigRow[] {
	const result = Papa.parse(csvContent, {
		header: true,
		skipEmptyLines: true,
		transformHeader: (header) => header.trim(),
	});

	return result.data.map((row:any) => ({
		jiraField: row.jiraField || '',
		jiraValue: row.jiraValue || '',
		description: row.description || '',
		group: row.group || ''
	}));
}

/**
 * Group rows by jiraField, then into ungrouped + named groups.
 */
export function groupRows(rows:JqlConfigRow[]):GroupedJqlConfig {
	const grouped:GroupedJqlConfig = {};

	for (const row of rows) {
		const field = row.jiraField?.trim();
		if (!field) continue;

		if (!grouped[field]) {
			grouped[field] = {
				ungrouped: [], // Matches your JqlConfigRow lowercase name
				groups: {},
			};
		}

		const groupName = row.group?.trim();

		if (groupName) {
			if (!grouped[field].groups[groupName]) {
				grouped[field].groups[groupName] = [];
			}
			grouped[field].groups[groupName].push(row);
		}
		else {
			grouped[field].ungrouped.push(row);
		}
	}

	return grouped;
}

/**
 * Build a JQL string from grouped config + selections.
 */
export function buildJqlFromSelection(
	grouped:GroupedJqlConfig,
	selections:SelectionMap,
):string {
	const clauses:string[] = [];

	for (const field of Object.keys(grouped)) {
		const fieldConfig = grouped[field];
		const selectedValues:string[] = [];

		// Correctly reference 'ungrouped' per your model
		const allRows = [
			...fieldConfig.ungrouped,
			...Object.values(fieldConfig.groups).flat()
		];

		for (const row of allRows) {
			const value = row.jiraValue?.trim();
			if (value && selections[field]?.[value]) {
				selectedValues.push(value);
			}
		}

		if (!selectedValues.length) continue;

		const uniqueValues = Array.from(new Set(selectedValues)).sort();

		// Quote field names with spaces (e.g. "Epic Link")
		const needsFieldQuotes = /[^\w]/.test(field);
		const renderedField = needsFieldQuotes ? `"${field}"` : field;

		if (uniqueValues.length === 1) {
			clauses.push(`${renderedField} = ${quoteValue(uniqueValues[0])}`);
		}
		else {
			const joinedValues = uniqueValues.map(quoteValue).join(', ');
			clauses.push(`${renderedField} in (${joinedValues})`);
		}
	}

	return clauses.join(' AND ');
}

function quoteValue(value:string):string {
	if (!value) return 'EMPTY';

	// Jira keys often have hyphens (DEV-123), so we must quote them
	const needsQuotes = /[^\w]/.test(value) || value.includes('-');

	if (needsQuotes) {
		const escaped = value.replace(/"/g, '\\"');
		return `"${escaped}"`;
	}

	return value;
}