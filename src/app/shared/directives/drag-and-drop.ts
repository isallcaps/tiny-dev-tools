import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[appDragAndDrop]',
	exportAs: 'appDragAndDrop'
})
export class DragAndDrop {

	@Output() fileDropped = new EventEmitter<File>();

	// This binds a class to the host element when a file is hovering over it
	@HostBinding('class.file-over') fileOver = false;

	// Dragover listener
	@HostListener('dragover', ['$event']) onDragOver(evt:DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = true;
	}

	// Dragleave listener
	@HostListener('dragleave', ['$event']) onDragLeave(evt:DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = false;
	}

	// Drop listener
	@HostListener('drop', ['$event']) onDrop(evt:DragEvent) {
		evt.preventDefault();
		evt.stopPropagation();
		this.fileOver = false;

		const files = evt.dataTransfer?.files;
		if (files && files.length > 0) {
			this.fileDropped.emit(files[0]);
		}
	}
}
