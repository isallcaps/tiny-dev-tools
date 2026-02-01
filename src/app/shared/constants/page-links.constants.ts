export class PageLinks {
	static readonly LoremButExact: PageLink = {
		path: 'lorem-but-exact',
		title: 'Lorem, but exact.',
		description: 'Generate text at an exact character length to test input and textarea limits.'
	};

	static readonly List: Array<PageLink> = [
		PageLinks.LoremButExact,
		{
			path: 'jira-query',
			title: 'Jira Query'
		}
	];
}

export interface PageLink {
	path: string;
	title: string;
	description?: string;
	disabled?: boolean;
}