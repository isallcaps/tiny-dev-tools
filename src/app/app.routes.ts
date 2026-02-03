import {Routes} from '@angular/router';
import {JQL_BUT_REUSABLE_TOOL, LOREM_BUT_EXACT_TOOL} from '@constants';

export const routes:Routes = [
	{
		path: '',
		title: 'Tiny Dev Tools',
		loadComponent: () => import('./features/home/home').then(m => m.Home)
	},
	{
		path: LOREM_BUT_EXACT_TOOL.path,
		title: LOREM_BUT_EXACT_TOOL.title,
		loadComponent: () => import('./features/lorem-but-exact/lorem-but-exact').then(m => m.LoremButExact)
	}, {
		path: JQL_BUT_REUSABLE_TOOL.path,
		title: JQL_BUT_REUSABLE_TOOL.title,
		loadComponent: () => import('./features/jql-but-reusable/jql-but-reusable').then(m => m.JqlButReusable)
	},
	{
		path: '**', redirectTo: ''
	}
];
