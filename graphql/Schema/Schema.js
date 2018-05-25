import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
import Model from '../../src/models/model';

const heroType = new GraphQLObjectType({
	name: 'Hero',
	fields: {
		name: { type: GraphQLString },
		worstAgaints: { type: GraphQLList(GraphQLString) },
		bestAgaints: { type: GraphQLList(GraphQLString) },
    image: { type: GraphQLString },
    avatar: { type: GraphQLString },
	}
});

const teamType = new GraphQLObjectType({
	name: 'Team',
	fields: {
		heroes: {
			type: GraphQLList(GraphQLString),
			resolve: ({ heroes }) => heroes,
		},
		worstAgaints: {
			type: GraphQLList(GraphQLString),
			resolve: ({ heroes }) => {
				const counters = Promise.all(
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
							return myCounters;
						} else {
							return worstAgaints[0];
						}
					});	
					return counters;
				},
		},
		bestAgaints: {
			type: GraphQLList(GraphQLString),
			resolve: ({ heroes }) => {
				const counters = Promise.all(
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
							return myCounters;
						} else {
							return bestAgaints[0];
						}
					});	
					return counters;
				},
		},
	}
});

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		hero: {
			type: heroType,
			args: {
				name: { type: GraphQLString }
			},
			resolve: (_, { name }) => {
				const heroInfo =  new Promise((resolve, reject) => {
					Model.findOne({'name': name}, function(err, data) {
						err ? reject(err) : resolve(data)
					});
				})
				return heroInfo;	
			}
		},
		team: {
			type: teamType,
			args: {
				heroes: { type: GraphQLList(GraphQLString) },
			},
			resolve: (_, { heroes }) => ({ heroes }),
		},
	}
})

const schema = new GraphQLSchema({ query: queryType });

export default schema;
