const fs = require('fs');
const api = require('./api.js');

if (process.argv.length != 4) {
	console.error('Not valid number of args.');
	console.error('Please call nodejs index.js <model> <output>');
	process.exit();
}

function run(script, outputFile) {
	api.outputFile = outputFile;
	var func = new Function(...(Object.keys(api)), script);
	func.apply(func, Object.values(api).map(f => {
		if (typeof Function === typeof f) {
			return function() {
				return f.apply(api, arguments);
			};
		} else {
			return f;
		}
	}));
}

var model = process.argv[2];
var output = process.argv[3];
fs.readFile(model, 'utf8', function(err, data) {
	if (err) {
		console.error(err);
		process.exit();
	}
	run(data, output);
});
