import {Routes} from '@angular/router';
import {LoremButExact} from "./lorem-but-exact/lorem-but-exact";
import {JiraQuery} from "./jira-query/jira-query";
import {Home} from "./home/home";

export const routes: Routes = [
	{
		path: '',
		component: Home,
		title: 'Tiny Dev Tools'
	},
	{
		path: 'lorem-but-exact',
		component: LoremButExact,
		title: 'Lorem But Exact'
	}, {
		path: 'jira-query',
		component: JiraQuery,
		title: 'Jira Query'
	},
	{path: '**', redirectTo: ''}
];
