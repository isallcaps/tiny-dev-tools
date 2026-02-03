import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {BrandComponent} from '@shared';
import {APP_VERSION} from '@constants';
import {NavMenu, ThemeService} from '@core';


@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, NavMenu, BrandComponent],
	templateUrl: './app.html',
	styles: ``
})
export class App {
	protected readonly title = signal('Tiny Dev Tools');
	readonly appVersion = APP_VERSION;

	public readonly themeService = inject(ThemeService);
}
