import {Component, input, signal} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
	selector: 'app-copy-to-clipboard-btn',
	standalone: true,
	imports: [NgClass],
	template: `
		<button
				type="button"
				class="btn d-inline-flex align-items-center justify-content-center"
				(click)="copyTextToClipboard()"
				[ngClass]="getButtonClasses()"
				[disabled]="!textToCopy() || copyStatus() === 'copied'"
				[attr.title]="copyStatus() === 'idle' ? 'Copy to clipboard' : null">

			<i class="bi lh-1"
			   [ngClass]="{
                'bi-clipboard': copyStatus() === 'idle',
                'bi-clipboard-check-fill': copyStatus() === 'copied',
                'bi-x-lg': copyStatus() === 'error'
             }"
			   style="font-size: 1.1rem;"></i>

			@if (copyStatus() !== 'idle') {
				<span class="ms-2 small fw-bold">
                {{ copyStatus() === 'copied' ? 'Copied!' : 'Error' }}
             </span>
			}
		</button>
	`,
	styles: `
      .btn {
        min-width: 42px;
        height: 38px;
        transition: all 0.2s ease-in-out;
        padding: 0;
      }
	`,
})
export class CopyToClipboardBtn {
	textToCopy = input<string>('');
	buttonClass = input<string>(''); // Defaulting to outline for a cleaner look

	copyStatus = signal<'idle' | 'copied' | 'error'>('idle');

	public async copyTextToClipboard():Promise<void> {
		const text = this.textToCopy();
		if (!text) return;

		try {
			await navigator.clipboard.writeText(text);
			this.copyStatus.set('copied');
		} catch (err) {
			this.copyStatus.set('error');
		} finally {
			setTimeout(() => this.copyStatus.set('idle'), 2000);
		}
	}

	getButtonClasses() {
		const status = this.copyStatus();
		const customClass = this.buttonClass();

		return {
			// If no custom class is provided AND we are idle, default to primary
			[customClass || 'btn-primary']: status === 'idle',

			// State-based overrides
			'btn-success': status === 'copied',
			'btn-danger': status === 'error',

			// Padding/Text color logic
			'px-3': status !== 'idle',
			'text-white': status !== 'idle' || (customClass ? !customClass.includes('outline') : true)
		};
	}
}