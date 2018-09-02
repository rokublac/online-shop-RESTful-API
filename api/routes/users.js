// jshint esversion:6
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // password hashing module

const User = require('../models/user');


// =========== POST requests =========== //
router.post('/signup', (req, res, next) => {
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
});


// =========== DELETE requests =========== //
router.delete('/:userId', (req, res, next) => {
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
});



module.exports = router;