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

export const TOOLS:readonly Tool[] = [
	LOREM_BUT_EXACT_TOOL,
	{
		id: TOOL_ID.JIRA_QUERY,
		path: TOOL_ID.JIRA_QUERY,
		title: 'Jira Query',
		disabled: true,
	},
] as const;
