import express from 'express';
import mongoose from 'mongoose';
import Model from './models/model';
import schema from '../graphql/Schema/Schema';
import graphqlHTTP from 'express-graphql';
import HeroDAO from './dao/hero-dao';

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

app.get('/hero/:name', async function(req, res) {
	const name = req.params.name;
	const hero = await HeroDAO.findOne({'name': name})
  res.json(hero)
});

app.get('/counter-me/:name', async function(req,res) {
	const name = req.params.name;
	const counters = await HeroDAO.findMyCounters({'name': name}, 'worstAgaints')
  res.json(counters);
});

app.get('/counter-us/:heroes', async function(req, res) {
	const heroes = req.params.heroes.split(',');
  const counters = await HeroDAO.findCounters(heroes, { 'bestAgaints': 0 }, 'worstAgaints');
  res.json(counters)
});

app.get('/i-counter/:name', async function(req,res) {
	const name = req.params.name;
	const counters = await HeroDAO.findMyCounters({'name': name}, 'bestAgaints')
  res.json(counters);
});

app.get('/we-counter/:heroes', async function(req, res) {
	const heroes = req.params.heroes.split(',');
  const counters = await HeroDAO.findCounters(heroes, { 'bestAgaints': 0 }, 'bestAgaints');
  res.json(counters)
});

app.listen(3000, function() {
	console.log("Server running on port 3000 with graphql api on /graphql");
});


export default db;
