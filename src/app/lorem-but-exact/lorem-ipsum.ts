import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LoremIpsum {
	private dictionaries = {
		latin: ['lorem', 'ipsum', 'consectetur', 'adipisicing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
			'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut',
			'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse',
			'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
			'non', 'proident', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
		],
		cupcake: [
			'cupcake', 'topping', 'sugar', 'plum', 'lollipop', 'tart', 'icing',
			'candy', 'canes', 'marzipan', 'gummi', 'bears', 'chocolate', 'bar',
			'powder', 'sesame', 'snaps', 'cheesecake', 'soufflé', 'jelly-o'
		],
		pirate: ['arr', 'matey', 'ahoy', 'scurvy', 'dog', 'landlubber', 'plunder']
	};


	generateWithPreAndSuffix(limit: number, type: 'latin' | 'cupcake' = 'latin', prefix: string = '', suffix: string = ''): string {
		const words = this.dictionaries[type];
		const targetBodyLength = limit - (prefix.length + suffix.length);

		if (targetBodyLength <= 0) {
			return (prefix + suffix).slice(0, limit);
		}

		let body = '';
		while (body.length < targetBodyLength) {
			body += words[Math.floor(Math.random() * words.length)] + ' ';
		}

		// 1. Cut the body to the exact size needed
		let cleanBody = body.substring(0, targetBodyLength);

		// 2. Combine them (No trim!)
		let combined = `${prefix}${cleanBody}${suffix}`;

		// 3. Capitalize and return
		return combined.replace(/[a-z]/i, (letter) => letter.toUpperCase());
	}
}
