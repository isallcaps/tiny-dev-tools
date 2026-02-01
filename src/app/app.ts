import {Component, signal} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {PageLinks} from "./shared/constants/page-links.constants";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, RouterLink, NgbCollapse],
	templateUrl: './app.html',
	styleUrl: './app.scss'
})
export class App {
	protected readonly title = signal('Tiny Dev Tools');

	protected readonly links = PageLinks.List;

	isMenuCollapsed = true;
}
