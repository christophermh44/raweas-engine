module.exports =
class M3ULine {
	constructor() {
		this.isEvent = false;
		this.duration = 0;
		this.artist = '';
		this.title = '';
		this.path = '-100';
		this.ID = '';
		this.cue_sta = '0';
		this.cue_int = '0';
		this.cue_xta = '0';
		this.cue_end = '0';
		this.cue_fin = '0';
		this.cue_fou = '0';
	}

	toM3U() {
		return [
			'#EXTINF:' + this.duration + ',' + this.artist + ' - ' + this.title,
			this.path,
			'#RDJDATA:' + this.ID + (this.isEvent ? '' : ':' + [this.cue_sta, this.cue_int - this.cue_sta, this.cue_xta, this.cue_end, this.cue_fin, this.cue_fou, 0, -100, 0, -100].join(':'))
		];
	}

	pick() {
		return this;
	}
};

