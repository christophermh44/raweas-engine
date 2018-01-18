module.exports = 
class RandomLines {
	constructor() {
		this.files = [];
		this.repeatRules = null;
	}

	random() {
		return this.files[Math.floor(Math.random() * this.files.length)];
	}

	shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	pick(history) {
		if (!!(this.repeatRules)) {
			var pickable = this.shuffle(this.files.slice(0));
			var pick = null;
			do {
				var p = pickable.shift();
				if (history.validate(p, this.repeatRules)) {
					pick = p;
				}
			} while (pick === null && pickable.length);
			return pick || this.random();
		} else {
			return this.random();
		}
	}
};

