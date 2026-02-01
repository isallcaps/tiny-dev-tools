import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
	selector: 'app-copy-to-clipboard-btn',
	imports: [
		NgClass
	],
	template: `
		<button
				type="button"
				class="btn {{buttonClass}}"
				(click)="copyTextToClipboard()"
				[ngClass]="{
					'btn-outline-primary': copyStatus === 'idle',
					'btn-success': copyStatus === 'copied',
					'btn-danger': copyStatus === 'error'
				}"
				[disabled]="!textToCopy || copyStatus === 'copied'">
			@if (copyStatus === 'idle') {
				<!-- Idle State: Default clipboard icon -->
				<i class="bi bi-clipboard"></i> Copy to Clipboard
			} @else if (copyStatus === 'copied') {
				<!-- Copied State: Success icon and text -->
				<i class="bi bi-clipboard-check-fill"></i> Copied!
			} @else if (copyStatus === 'error') {
				<!-- Error State: Error icon and text -->
				<i class="bi bi-x-lg"></i> Error
			}
		</button>
	`,
	styles: `
		.btn {
			/* Ensures the button width doesn't change drastically when text changes */
			min-width: 110px;
			/* Smooth transition for color changes */
			transition: all 0.2s ease-in-out;
		}

		/* Add a small space between the icon and the text */
		.btn i {
			margin-right: 0.4rem;
		}

	`,
})
/**
 * `CopyToClipboardBtn` provides a button that allows copying text to the clipboard.
 * It reacts to the button's states (idle, copied, error) and provides visual feedback to the user.
 *
 * @selector app-copy-to-clipboard-btn
 * @example
 * <app-copy-to-clipboard-btn
 *    [textToCopy]="'Sample text to copy'"
 *    [buttonClass]="'btn-primary'">
 * </app-copy-to-clipboard-btn>
 */
export class CopyToClipboardBtn {
	/**
	 * Text to copy to the clipboard.
	 * This is the value that will be copied when the user clicks the button.
	 *
	 * @input
	 * @type {string}
	 * @default '' (empty string)
	 */
	@Input() textToCopy: string = '';


	/**
	 * Class to customize the appearance of the button.
	 * This allows the developer to apply custom styles.
	 *
	 * @input
	 * @type {string}
	 * @optional
	 */
	@Input() buttonClass: string;

	/**
	 * Tracks the current state of the button.
	 * - `'idle'`: Default state when the button is waiting for user action.
	 * - `'copied'`: State after a successful clipboard copy.
	 * - `'error'`: State after a clipboard copy failure.
	 *
	 * @type {'idle' | 'copied' | 'error'}
	 * @default 'idle'
	 */
	public copyStatus: 'idle' | 'copied' | 'error' = 'idle';


	/**
	 * Copies `textToCopy` to the user's clipboard.
	 * This method uses the `navigator.clipboard.writeText()` API to copy the text asynchronously.
	 * - On success: Updates the button state to `'copied'` and resets to `'idle'` after 2 seconds.
	 * - On error: Updates the button state to `'error'` and resets to `'idle'` after 2 seconds.
	 *
	 * @returns {Promise<void>} A promise that resolves after the clipboard write operation.
	 */
	public async copyTextToClipboard(): Promise<void> {
		try {
			// Copy the text to clipboard
			await navigator.clipboard.writeText(this.textToCopy);

			// Update the state to indicate successful copy
			this.copyStatus = 'copied';

			// Reset the state back to idle after 2 seconds
			setTimeout(() => this.copyStatus = 'idle', 2000);
		} catch (err) {
			// Log the error to the console for debugging purposes
			console.error('Failed to copy text: ', err);

			// Update the state to indicate an error
			this.copyStatus = 'error';

			// Reset the state back to idle after 2 seconds
			setTimeout(() => this.copyStatus = 'idle', 2000);
		}
	}
}
