const db = require('./db/database');
const execute = require('./execute');
const M3ULine = require('./classes/M3ULine');
const RandomLines = require('./classes/RandomLines');
const Group = require('./classes/Group');
const Rotation = require('./classes/Rotation');
const RepeatRule = require('./classes/RepeatRule');
const Show = require('./classes/Show');

module.exports = {
	file: function(id, forceDuration) {
		var row = db.one('SELECT * FROM songs WHERE ID = ?', [id]);
		if (row == null) {
			throw 'File with ID ' + id + ' not found.';
		}
		var line = new M3ULine;
		line.ID = row.ID;
		line.artist = row.artist;
		line.title = row.title;
		line.path = row.path;
		line.duration = parseInt(forceDuration) || Math.round(parseFloat(row.duration));
		var cues = row.cue_times.split('&').filter(cue => /^[a-z]{3}=[0-9]+(?:\.[0-9]+)?$/.test(cue)).forEach(cue => {
			[name, value] = cue.split('=');
			line['cue_' + name] = value;
		});
		return line;
	},
	subcategory: function(id, repeatRules) {
		var rows = db.query('SELECT * FROM songs WHERE id_subcat = ?', [id]);
		var lines = new RandomLines;
		var self = this;
		rows.forEach(row => {
			lines.files.push(self.file(row.ID));
		});
		lines.repeatRules = repeatRules;
		return lines;
	},
	rotation: function() {
		var rotation = new Group;
		Array.from(arguments).forEach(item => {
			rotation.items.push(item);
		});
		return rotation;
	},
	event: function(id) {
		var row = db.one('SELECT * FROM events WHERE ID = ?', [id]);
		if (row == null) {
			throw 'Event with ID ' + id + ' not found.';
		}
		var line = new M3ULine;
		line.ID = row.ID;
		line.artist = 'EVENT';
		line.title = row.name;
		line.isEvent = true;
		return line;
	},
	repeat_rule: function(sameArtist, sameTitle) {
		var rr = new RepeatRule;
		rr.sameArtist = sameArtist * 60;
		rr.sameTitle = sameTitle * 60;
		return rr;
	},
	rotate: function(rotation, until) {
		var r = new Rotation;
		r.rotation = rotation;
		if (!(/^[0-9]+\:[0-9]{2}$/.test(until))) {
			throw '"' + until + '" is not a valid duration.';
		}
		[minutes, seconds] = until.split(':');
		r.seconds = parseInt(minutes) * 60 + parseInt(seconds);
		return r;
	},
	outputFile: null,
	run: function() {
		var show = new Show;
		Array.from(arguments).forEach(item => {
			show.items.push(item);
		});
		execute(show, this.outputFile);
	}
};
