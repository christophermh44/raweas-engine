const MySql = require('sync-mysql');
const credentials = require('./credentials.js');
const connection = new MySql(credentials);
module.exports = {
	query: function(str, values) {
		return connection.query(str, values);
	},
	one: function(str, values) {
		var rows = this.query(str, values);
		return rows.length > 0 ? rows[0] : null;
	}
};
