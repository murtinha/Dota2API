import express from 'express';
import mongoose from 'mongoose';
import Model from './models/model';

mongoose.connect('mongodb://localhost:27017/heroesdb', { autoIndex: false });

const db = mongoose.connection;

db.once('open', function() {
	console.log('Connected to MongoDB!');
})

db.on('error', function(err){
	console.log(err);	
})

const app = express();

app.get('/', function (req, res) {
	res.send("WELCOME TO DOTA 2 COUNTER ME");
});

app.get('/hero/:name', function(req, res) {
	const name = req.params.name;
	Model.findOne({'name': name}, function(err, hero) {
		if (err) return handleError(err);
		res.json(hero)
	});
});

app.get('/counter/:heroes', function(req, res) {
	const heroes = req.params.heroes.split(',');
	Model.find({ 'name': { $in: heroes } }, function(err, counters) {
		if (err) return handleError(err);
		res.json(counters)
	});
});

app.listen(3000, function() {
	console.log("Server running on port 3000");
});


export default db;
