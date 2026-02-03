import {Routes} from '@angular/router';
import {LoremButExact} from './lorem-but-exact/lorem-but-exact';
import {JqlButReusable} from './jql-but-reusable/jql-but-reusable';
import {Home} from './home/home';
import {JQL_BUT_REUSABLE_TOOL, LOREM_BUT_EXACT_TOOL} from '@constants';

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
		path: JQL_BUT_REUSABLE_TOOL.path,
		component: JqlButReusable,
		title: JQL_BUT_REUSABLE_TOOL.title
	},
	{path: '**', redirectTo: ''}
];
