import {Component, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavMenu} from './nav-menu/nav-menu';
import {APP_VERSION} from './shared/constants/version.constants';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, NavMenu],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('Tiny Dev Tools');
	readonly appVersion = APP_VERSION;
}
