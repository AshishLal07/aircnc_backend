const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_URL,
	{useNewUrlParser: true,
	useUnifiedTopology: true,});
// console.log(process.env.MONGO_URL);
const db = mongoose.connection;

db.on(
	'error',
	console.error.bind(console, 'Error while connecting to the mongodb')
);

db.once('open', () => {
	console.log('Succesfully connected to the database:: MongoDB');
});

module.exports = db;
