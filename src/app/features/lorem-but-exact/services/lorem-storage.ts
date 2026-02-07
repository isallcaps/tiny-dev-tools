import {Injectable, signal} from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LoremStorage {
	private readonly STORAGE_KEY = 'lorem_custom_limits';

	// Using a Signal so the UI updates automatically when limits change
	customLimits = signal<number[]>(this.load());

	private load():number[] {
		const saved = localStorage.getItem(this.STORAGE_KEY);
		return saved ? JSON.parse(saved) : [50, 100, 250, 500]; // Default values
	}

	addLimit(limit:number) {
		const updated = [...new Set([...this.customLimits(), limit])].sort((a, b) => a - b);
		this.customLimits.set(updated);
		this.save(updated);
	}

	removeLimit(limit:number) {
		const updated = this.customLimits().filter(l => l !== limit);
		this.customLimits.set(updated);
		this.save(updated);
	}

	private save(limits:number[]) {
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limits));
	}
}
