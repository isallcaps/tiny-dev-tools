export interface JqlConfigRow {
	jiraField:string;     // e.g. "project", "labels", "component"
	jiraValue:string;     // e.g. "Dev-1234", "Home"
	description?:string;  // optional, for UI hints
	group?:string;        // optional, e.g. "UI Screen"
}

// field → groupName → rows
export interface GroupedJqlConfig {
	[field:string]:{
		[groupName:string]:JqlConfigRow[];
	};
}

// selections: field → value → checked
export interface SelectionMap {
	[field:string]:{
		[jiraValue:string]:boolean;
	};
}