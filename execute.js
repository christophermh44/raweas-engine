const fs = require('fs');
const M3ULine = require('./classes/M3ULine');
const RandomLines = require('./classes/RandomLines');
const Group = require('./classes/Group');
const Rotation = require('./classes/Rotation');
const RepeatRule = require('./classes/RepeatRule');
const Show = require('./classes/Show');
const History = require('./classes/History');

var m3u = [];
var duration = 0;
var history = new History;

function addItem(item) {
	m3u.push(...(item.toM3U()));
	duration+= parseInt(item.duration);
	if (!(item.isEvent)) {
		history.push(item.ID, item.artist, item.title, item.duration);
	}
}

module.exports = function(show, outputFile) {
	m3u.push('#EXTM3U');
	show.items.forEach(item => {
		switch (true) {
			case item instanceof M3ULine:
				addItem(item);
			break;
			case item instanceof Group:
				item.start();
				for (var i = 0; i < item.items.length; ++i) {
					addItem(item.next(history));
				}
			break;
			case item instanceof RandomLines:
				addItem(item.pick(history));
			break;
			case item instanceof Rotation:
				item.rotation.start();
				var toAdd = [];
				var d = duration;
				while (d < item.seconds) {
					var pick = item.rotation.next(history);
					toAdd.push(pick);
					d+= pick.duration;
				}
				var last = toAdd[toAdd.length - 1];
				var withLast = Math.abs(d - item.seconds);
				var withoutLast = Math.abs((d - last.duration) - item.seconds);
				if (withoutLast < withLast) {
					toAdd.pop();
				}
				toAdd.forEach(i => {
					addItem(i);
				});
			break;
		}
	});
	if (outputFile == null) {
		console.log(m3u.join("\n"));
	} else {
		fs.writeFileSync(outputFile, m3u.join("\n"));
	}
};
