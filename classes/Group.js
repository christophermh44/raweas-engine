module.exports =
class Group {
	constructor() {
		this.items = [];
	}

	start() {
		this.index = 0;
	}

	next(history) {
		var item = this.items[this.index].pick(history);
		this.index = (this.index + 1) % this.items.length;
		return item;
	}

	pick() {
		return this;
	}
};

