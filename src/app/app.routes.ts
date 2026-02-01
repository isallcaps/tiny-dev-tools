import {Routes} from '@angular/router';
import {LoremButExact} from './lorem-but-exact/lorem-but-exact';
import {JiraQuery} from './jira-query/jira-query';
import {Home} from './home/home';
import {LOREM_BUT_EXACT_TOOL} from './shared/constants/tools.constants';

export const routes:Routes = [
	{
		path: '',
		component: Home,
		title: 'Tiny Dev Tools'
	},
	{
		path: LOREM_BUT_EXACT_TOOL.path,
		component: LoremButExact,
		title: LOREM_BUT_EXACT_TOOL.title
	}, {
		path: 'jira-query',
		component: JiraQuery,
		title: 'Jira Query'
	},
	{path: '**', redirectTo: ''}
];
