module.exports =
class History {
	constructor() {
		this.history = [];
	}

	push(ID, artist, title, duration) {
		this.history.push({
			ID: ID,
			artist: artist,
			title: title,
			duration: duration
		});
	}

	pop() {
		this.history.pop();
	}
	
	validate(pick, repeatRules) {
		var valid = true;
		var index = this.history.length - 1;
		var duration = 0;
		var checkForArtist = true;
		var checkForTitle = true;
		while (valid && index >= 0) {
			var item = this.history[index--];
			if (!(item.isEvent)) {
				if ((checkForTitle && item.ID == pick.ID) || (checkForArtist && item.artist == pick.artist)) {
					valid = false;
				}
			}
			duration+= parseInt(item.duration);
			if (duration > repeatRules.sameArtist) {
				checkForArtist = false;
			}
			if (duration > repeatRules.sameTitle) {
				checkForTitle = false;
			}
			if (!checkForArtist && !checkForTitle && valid) {
				break;
			}
		}
		return valid;
	}
}
