const {MongoClient, ServerApiVersion} = require('mongodb');
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let database;


module.exports = {
	run: async function(callback) {
		await client.connect(err => err ? callback(err): callback());
		database = await client.db('taskManager');
		console.log('connecting...')
	},
	getDb: function() {
		return database;
	}
}
