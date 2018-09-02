// jshint esversion:6
const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	email: {
		type: String,
		required: true,
		// unique is not a validation. It is mainly for search indexing and query performance. 
		unique: true, 
		// regex email validation
		match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
	}, 
	password: { type: String, required: true}
});

module.exports = mongoose.model('Users', userSchema);