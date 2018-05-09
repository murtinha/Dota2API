import db from '../app';
import mongoose from 'mongoose';
import heroes from '~/data';
import dataSchema from './schema';

const Model = mongoose.model('Data', dataSchema);
const obj = {};

const createDb = () => {
	Object.keys(heroes).forEach(function(hero) {
		obj[hero] = {
			name: hero,
			bestAgaints: heroes[hero].bestAgaint,
			worstAgaints: heroes[hero].worstAgaint,
		};
		let	saveHero = new Model(obj[hero]);
		saveHero.save().then(result => {
			console.log(result)	
		}).catch(err => console.log(err));
	})
};

export default Model;
