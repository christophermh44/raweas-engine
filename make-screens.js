require('datejs');
const fs = require('fs');
const api = require('./api');
const db = require('./db/database');
var prefixOutput = process.argv[2];
var year = process.argv[3];
var month = process.argv[4];
var day = process.argv[5];
var allScreens = require('./commercials/screens.json');
var allAds = require('./commercials/ads.json');
var dows = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
var tomorrow = Date.parse(year + '-' + month + '-' + day + 'T00:00:00');
var dow = tomorrow.getDay();
var keyDow = dows[dow];
var screens = allScreens[keyDow];
var maxHistorySize = 4;
var history = [];

function isValidTiming(item, time, dow) {
	if (!!(item.always)) return true;
	if (!(item[dow])) return false;
	var rules = item[dow];
	return time >= rules[0] && time < rules[1];
}

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function pickAd(ads, type, time, dow, history) {
	var adsByType = ads.filter(ad => ad.type == type);
	var ad = null;
	var shuffledAds = shuffle(adsByType.slice(0));
	do {
		var item = shuffledAds.shift();
		if (isValidTiming(item, time, dow) && history.indexOf(item.ID) < 0) {
			ad = item;
		}
	} while (ad == null && shuffledAds.length > 0);
	if (ad == null) {
		ad = adsByType[Math.floor(Math.random() * adsByType.length)];
	}
	return ad;
}

function generateM3ULines(ID) {
	var file = api.file(ID);
	return file.toM3U().join("\n");
}

screens.forEach(screen => {
	var time = screen.time;
	var filename = prefixOutput + time.replace(':', '') + '.m3u';
	ads = [];
	campaigns = screen.campaigns;
	campaigns.forEach(campaign => {
		if (!(history[campaign])) {
			history[campaign] = [];
		}
		ad = pickAd(allAds, campaign, time, keyDow, history[campaign]);
		history[campaign].push(ad.ID);
		if (history[campaign].length > maxHistorySize) {
			history[campaign].shift();
		}
		ads.push(ad.ID);
	});
	lines = [];
	lines.push('#EXTM3U');
	ads.forEach(ad => {
		lines.push(generateM3ULines(ad));
	});
	var m3u = lines.join("\n");
	fs.writeFileSync(filename, m3u);
});
