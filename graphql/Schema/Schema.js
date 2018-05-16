import { GraphQLObjectType, GraphQLString, GraphQLSchema } from 'graphql';
import Model from '../../src/models/model';

const heroType = new GraphQLObjectType({
	name: 'Hero',
	fields: {
		name: { type: GraphQLString },
		worstAgainst: { type: GraphQLString },
		bestAgainst: { type: GraphQLString },
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
		}
	}
})

const schema = new GraphQLSchema({ query: queryType });

export default schema;