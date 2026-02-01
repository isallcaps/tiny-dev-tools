import {GroupedJqlConfig, JqlConfigRow, SelectionMap} from '../models/jql-config.model';

/**
 * Parse CSV text into JqlConfigRow objects.
 * Expected header: jiraField,jiraValue,description,group
 */
export function parseJqlCsv(csv:string):JqlConfigRow[] {
	const lines = csv
		.split(/\r?\n/)
		.map(line => line.trim())
		.filter(Boolean);

	if (!lines.length) return [];

	const [headerLine, ...dataLines] = lines;
	const headers = headerLine
		.split(',')
		.map(h => h.trim().toLowerCase());

	const idxField = headers.indexOf('jirafield');
	const idxValue = headers.indexOf('jiravalue');
	const idxDescription = headers.indexOf('description');
	const idxGroup = headers.indexOf('group');

	if (idxField === -1 || idxValue === -1) {
		console.warn('CSV missing required headers: jiraField,jiraValue');
		return [];
	}

	return dataLines.reduce<JqlConfigRow[]>((acc, line) => {
		const cols = line.split(',').map(c => c.trim());

		const jiraField = cols[idxField];
		const jiraValue = cols[idxValue];

		if (!jiraField || !jiraValue) return acc;

		acc.push({
			jiraField,
			jiraValue,
			description: idxDescription >= 0 ? cols[idxDescription] || undefined : undefined,
			group: idxGroup >= 0 ? cols[idxGroup] || undefined : undefined,
		});

		return acc;
	}, []);
}

/**
 * Group rows by jiraField, then by group name.
 * Empty group becomes "General".
 */
export function groupRows(rows:JqlConfigRow[]):GroupedJqlConfig {
	const grouped:GroupedJqlConfig = {};

	for (const row of rows) {
		const field = row.jiraField;
		const groupName = row.group?.trim() || 'General';

		grouped[field] ??= {};
		grouped[field][groupName] ??= [];

		grouped[field][groupName].push(row);
	}

	return grouped;
}

/**
 * Build a JQL query string from grouped config + selections.
 * Group names are UI-only and ignored.
 */
export function buildJqlFromSelection(
	grouped:GroupedJqlConfig,
	selections:SelectionMap,
):string {
	const clauses:string[] = [];

	for (const field of Object.keys(grouped)) {
		const groups = grouped[field];
		const selectedValues:string[] = [];

		for (const groupName of Object.keys(groups)) {
			for (const row of groups[groupName]) {
				const value = row.jiraValue.trim();
				if (selections[field]?.[value]) {
					selectedValues.push(value);
				}
			}
		}

		if (!selectedValues.length) continue;

		const uniqueValues = Array.from(new Set(selectedValues)).sort();

		// Quote field names with spaces or non-word chars (e.g. "Epic Link")
		const renderedField =
			/[^\w]/.test(field) ? `"${field}"` : field;

		if (uniqueValues.length === 1) {
			const v = uniqueValues[0];
			clauses.push(
				`${renderedField} = ${quoteIfNeeded(v)}`
			);
		}
		else {
			clauses.push(
				`${renderedField} in (${uniqueValues.map(quoteIfNeeded).join(', ')})`
			);
		}
	}

	return clauses.join(' AND ');
}

/* ---------- helpers ---------- */

function quoteIfNeeded(value:string):string {
	return /[\s-]/.test(value) ? `"${value}"` : value;
}
