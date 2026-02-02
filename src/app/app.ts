import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NavMenu} from './nav-menu/nav-menu';
import {APP_VERSION} from './core/constants/version.constants';
import {ThemeService} from './core/services/theme';
import {BrandComponent} from './shared/components/brand/brand';

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
