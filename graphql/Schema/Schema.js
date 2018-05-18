import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLSchema } from 'graphql';
import Model from '../../src/models/model';

const heroType = new GraphQLObjectType({
	name: 'Hero',
	fields: {
		name: { type: GraphQLString },
		worstAgaints: { type: GraphQLList(GraphQLString) },
		bestAgaints: { type: GraphQLList(GraphQLString) },
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
		counterUs: {
			type: GraphQLList(GraphQLString),
			args: {
				heroes: { type: GraphQLList(GraphQLString) },
			},
			resolve: (_, { heroes }) => {
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
		}
})

const schema = new GraphQLSchema({ query: queryType });

export default schema;
