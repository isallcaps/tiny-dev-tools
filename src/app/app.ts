import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavMenu} from './nav-menu/nav-menu';
import {BrandComponent} from '@shared';
import {APP_VERSION} from '@constants';
import {ThemeService} from '@core';


@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, NavMenu, BrandComponent],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('Tiny Dev Tools');
	readonly appVersion = APP_VERSION;

	themeService = inject(ThemeService);
}
