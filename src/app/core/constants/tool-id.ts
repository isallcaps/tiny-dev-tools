export const TOOL_ID = {
	LOREM_BUT_EXACT: 'lorem-but-exact',
	JIRA_QUERY: 'jql-but-reusable',
} as const;

export type ToolId = typeof TOOL_ID[keyof typeof TOOL_ID];