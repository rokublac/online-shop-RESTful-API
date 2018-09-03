// jshint esversion:6
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // password hashing module
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // data model



// === GET all users === //
exports.users_get_all_users = (req, res, next) => {
	const pw = req.params.password;
	if (pw == 'password') {
		User.find()
			.exec()
			.then(docs => {
				res.status(200).json({
					count: docs.length,
					products: docs.map(doc => {
						return {
							_id: doc._id,
							email: doc.email
						};
					}) 	
				});
			})
			.catch(err => {
				res.status(500).json({error:err});
			});
		} else {
			res.status(401).json({ message: "Auth Failed"});
		}
	
};


// === [LOGIN] POST user === //
exports.users_login_user = (req, res, next) => {
	User.findOne({ email: req.body.email })
	  .exec()
	  .then(user => {
	  	if (!user) {
	  		return res.status(401).json({
	  			message: "Auth failed"
	  		});
	  	} else {
	  		bcrypt.compare(req.body.password, user.password, (err, result) => {
	  			if (err) {
	  				return res.status(401).json({
			  			message: "Auth failed"
			  		});
	  			}
	  			if (result) {
	  				// generate user token
	  				const token = jwt.sign({
	  					email: user.email,
	  					userId: user._id
	  				},
	  				'secret', {expiresIn: "1h"});

	  				return res.status(200).json({
	  					message: "Auth Successful",
	  					token: token
	  				});
	  			}
	  			res.status(401).json({
		  			message: "Auth failed"
		  		});
	  		});
	  	}
	  	
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({
	  		error: err
	  	});
	  });
};


// === [SIGNUP] POST user === //
exports.users_signup_user = (req, res, next) => {
	// check to see if email already exists
	User.find({ email:req.body.email })
	  .exec()
	  .then(user => {
	  	// .find returns array so we need to chcek length
	  	if (user.length >= 1) {
	  		return res.status(409).json({
	  			message: "Email exists"
	  		});
	  	} else {
	  		bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					return res.status(500).json({
						error: err
					});
				} else {
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						// hash password with salt (default 10 salt rounds)
						password: hash
					});
					user
					  .save()
					  .then(result => {
					  	console.log(result);
					  	res.status(201).json({
					  		message: 'User created!'
					  	});
					  })
					  .catch(err => {
					  	console.log(err);
					  	res.status(500).json({
					  		error: err
					  	});
					  });
				}
			});
  		}	
	});
};


// === DELETE user === //
exports.users_delete_user = (req, res, next) => {
	User.remove({ _id: req.params.userId})
	  .exec()
	  .then(() => {
	  	res.status(200).json({
	  		message: "User successfully deleted!"
	  	});
	  })
	  .catch(err => {
	  	console.log(err);
	  	res.status(500).json({
	  		error: err
	  	});
	  });
};