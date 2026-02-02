import {Injectable, signal, effect} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ThemeService {
	// Check system preference or localStorage for initial state
	theme = signal<'light' | 'dark'>(
		(localStorage.getItem('theme') as 'light' | 'dark') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	);

	constructor() {
		// Effect runs automatically whenever the theme signal changes
		effect(() => {
			const current = this.theme();
			document.documentElement.setAttribute('data-bs-theme', current);
			localStorage.setItem('theme', current);
		});
	}

	toggleTheme() {
		this.theme.update(t => t === 'light' ? 'dark' : 'light');
	}
}