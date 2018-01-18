const fs = require('fs');
const api = require('./api.js');

if (process.argv.length != 3) {
	console.error('Not valid number of args.');
	console.error('Please call nodejs index.js <file>');
	process.exit();
}

function run(script) {
	var func = new Function(...(Object.keys(api)), script);
	func.apply(func, Object.values(api).map(f => {
		return function() {
			return f.apply(api, arguments);
		};
	}));
}

var model = process.argv[2];
fs.readFile(model, 'utf8', function(err, data) {
	if (err) {
		console.error(err);
		process.exit();
	}
	run(data);
});
