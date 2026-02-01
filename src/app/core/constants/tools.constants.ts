import {ToolId, TOOL_ID} from './tool-id';

export interface Tool {
	id:ToolId;
	path:ToolId;
	title:string;
	description?:string;
	disabled?:boolean;
	badge?:string;
}

export const LOREM_BUT_EXACT_TOOL:Tool = {
	id: TOOL_ID.LOREM_BUT_EXACT,
	path: TOOL_ID.LOREM_BUT_EXACT,
	title: 'Lorem, but exact',
	description:
		'Generate text at an exact character length to test input and textarea limits.',
};

export const JQL_BUT_REUSABLE_TOOL:Tool = {
	id: TOOL_ID.JIRA_QUERY,
	path: TOOL_ID.JIRA_QUERY,
	title: 'JQL, but reusable',
	description: 'Build JQL queries from saved field values instead of retyping the same Jira fields.',
};

export const TOOLS:readonly Tool[] = [
	LOREM_BUT_EXACT_TOOL,
	JQL_BUT_REUSABLE_TOOL,
] as const;
