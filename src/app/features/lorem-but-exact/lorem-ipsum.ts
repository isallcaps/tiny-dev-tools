import {Injectable} from '@angular/core';

export type LoremFlavor = 'latin' | 'cupcake' | 'pirate';

@Injectable({
	providedIn: 'root',
})
export class LoremIpsum {
	private readonly DICTIONARIES:Record<LoremFlavor, string[]> = {
		latin: ['lorem', 'ipsum', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'],
		cupcake: ['cupcake', 'topping', 'sugar', 'plum', 'lollipop', 'tart', 'icing', 'candy', 'canes', 'marzipan', 'gummi', 'bears', 'chocolate', 'bar', 'powder', 'sesame', 'snaps', 'cheesecake', 'soufflé', 'jelly-o', 'sweet', 'roll', 'muffin', 'halvah', 'wafer', 'pastry', 'cotton', 'candy', 'oat', 'cake', 'apple', 'pie', 'dragée', 'gingerbread', 'caramels', 'bonbon', 'donut', 'liquorice', 'tapioca'],
		pirate: ['arr', 'matey', 'ahoy', 'scurvy', 'dog', 'landlubber', 'plunder', 'treasure', 'map', 'galleon', 'doubloon', 'shiver', 'me', 'timbers', 'black', 'spot', 'avast', 'buckaneer', 'crow\'s', 'nest', 'dead', 'men', 'tell', 'no', 'tales', 'heave', 'ho', 'jolly', 'roger', 'keelhaul', 'mutiny', 'old', 'salt', 'parley', 'peg', 'leg', 'privateer', 'sea', 'dog', 'walk', 'the', 'plank', 'yo', 'ho', 'ho']
	};

	generateWithPreAndSuffix(limit:number, type:LoremFlavor = 'latin', prefix:string = '', suffix:string = ''):string {
		const words = this.DICTIONARIES[type];
		const targetBodyLength = limit - (prefix.length + suffix.length);

		if (targetBodyLength <= 0) {
			return (prefix + suffix).slice(0, limit);
		}

		let body = '';
		while (body.length < targetBodyLength) {
			const randomIndex = Math.floor(Math.random() * words.length);
			let word = words[randomIndex];

			// Add some visual variety: 10% chance of capitalization
			if (Math.random() > 0.9) {
				word = word.charAt(0).toUpperCase() + word.slice(1);
			}

			body += word + ' ';
		}

		// 1. Cut the body to the exact size needed
		let cleanBody = body.substring(0, targetBodyLength);

		// 2. Combine and ensure the very first letter of the result is capitalized
		const combined = `${prefix}${cleanBody}${suffix}`;
		return combined.charAt(0).toUpperCase() + combined.slice(1);
	}
}