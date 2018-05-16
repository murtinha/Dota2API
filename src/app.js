import express from 'express';
import mongoose from 'mongoose';
import Model from './models/model';
import schema from '../graphql/Schema/Schema';
import graphqlHTTP from 'express-graphql';

mongoose.connect('mongodb://localhost:27017/heroesdb', { autoIndex: false });

const db = mongoose.connection;

db.once('open', function() {
	console.log('Connected to MongoDB!');
})

db.on('error', function(err){
	console.log(err);	
})

const app = express();

app.use('/graphql', graphqlHTTP({
	schema,
	graphiql: true,
}));

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

app.get('/counter-me/:name', function(req,res) {
	const name = req.params.name;
	Model.findOne({'name': name}, function(err, hero) {
		if (err) return handleError(err);
		res.json(hero.worstAgaints)
	});
});

app.get('/counter-us/:heroes', function(req, res) {
	const heroes = req.params.heroes.split(',');
	Promise.all(
		heroes.map(h=> Model.findOne({ 'name': h }, { 'bestAgaints': 0 }, function(err, counters) {
			return new Promise((resolve, reject) => {
				if (err) {
					reject(err);
				} else {
					resolve(counters);
				}
			});
		}))
	).then(counters => {
		const worstAgaints = counters.map(counter => counter.worstAgaints);
		if (worstAgaints.length > 1) {
			const [hdWorstAgaints] = worstAgaints.splice(0,1);
			const myCounters = hdWorstAgaints.filter(hero => {
				return worstAgaints.every(counters => {
					return !!~counters.indexOf(hero)
				})
			});
			res.json(myCounters)
		} else {
			res.json(...worstAgaints)
		}
	});	
});

app.get('/i-counter/:name', function(req,res) {
	const name = req.params.name;
	Model.findOne({'name': name}, function(err, hero) {
		if (err) return handleError(err);
		res.json(hero.bestAgaints)
	});
});

app.get('/we-counter/:heroes', function(req, res) {
	const heroes = req.params.heroes.split(',');
	Promise.all(
		heroes.map(h=> Model.findOne({ 'name': h }, { 'worstAgaints': 0 }, function(err, counters) {
			return new Promise((resolve, reject) => {
				if (err) {
					reject(err);
				} else {
					resolve(counters);
				}
			});
		}))
	).then(counters => {
		const bestAgaints = counters.map(counter => counter.bestAgaints);
		if (bestAgaints.length > 1) {
			const [hdBestAgaints] = bestAgaints.splice(0,1);
			const myCounters = hdBestAgaints.filter(hero => {
				return bestAgaints.every(counters => {
					return !!~counters.indexOf(hero)
				})
			});
			res.json(myCounters)
		} else {
			res.json(...bestAgaints)
		}
	});	
});

// FGOD solution
// app.get('/counter-us/:heroes', async function(req, res) {
// 	const heroes = req.params.heroes.split(',');
// 	const results = await Promise.all(
// 			heroes.map( h => Model.findOne({ 'name': h }, { 'bestAgaints': 0 }, function(err, counters) {
// 				return new Promise((resolve, reject) => {
// 					if (err) {
// 						reject(err);
// 					} else {
// 						console.log(counters.worstAgaints)
// 						resolve(counters);
// 					}
// 				});
// 			}))
// 	);
// 	res.send(results)
// });

app.listen(3000, function() {
	console.log("Server running on port 3000 with graphql api on /graphql");
});


export default db;
