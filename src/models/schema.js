import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const dataSchema = new Schema({
		name: {
			type: String,
			required: true,
		},
		bestAgaints: {
			type: Array,
			required: true,
		},
		worstAgaints: {
			type: Array,
			required: true,
		},
});

export default dataSchema;
