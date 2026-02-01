import {Observable} from 'rxjs';

/**
 * Reads a File object and returns its content as a string stream.
 */
export function readFileAsText(file:File):Observable<string> {
	return new Observable<string>((subscriber) => {
		if (!file) {
			subscriber.error('No file provided');
			return () => {
			};
		}

		const reader = new FileReader();

		reader.onload = () => {
			subscriber.next(reader.result?.toString() ?? '');
			subscriber.complete();
		};

		reader.onerror = () => {
			subscriber.error(new Error(`Error reading file: ${file.name}`));
		};

		reader.onabort = () => {
			subscriber.error(new Error('File reading aborted'));
		};

		reader.readAsText(file);

		return () => {
			if (reader.readyState === 1) {
				reader.abort();
			}
		};
	});
}