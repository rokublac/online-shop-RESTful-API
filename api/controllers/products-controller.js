// jshint esversion:6
const mongoose = require('mongoose');
const Product = require('../models/product'); // data model


// === GET all products === //
exports.products_get_all = (req, res, next) => {
	// if there is no data in the products collection it will return an empty array. 
	Product.find()
		.select('_id name price productImage') // specifiying data properties to select on request
		.exec()
		.then(docs => {
			const getResponse = {
				count: docs.length,
				// products will be returned as an array if there is more than one.
				// map function to return new array which includes meta data such as it's specific GET request url
				products: docs.map(doc => {
					return {
						_id: doc._id,
						name: doc.name,
						price: doc.price,
						productImage: doc.productImage,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + doc._id
						}
					};
				}) 	
			};
			res.status(200).json(getResponse);
		})
		.catch(err => {
			res.status(500).json({error:err});
		});
};


// === GET product by ID === //
exports.products_get_by_id = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select('_id name price productImage')
		.exec()
		.then(doc => {
			// check to see if ID actually exists. Note: a valid ID does not mean there is data attached to it. It will return null.
			// check if doc is not null and data exists for the ID
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: 'GET',
						desciption: 'GET_ALL_PRODUCTS',
						url: 'http://localhost:3000/products'
					}
				});
			} else {
				res.status(404).json({message:"No valid entry found for ID"});
			}
		})
		.catch(err => {
			res.status(500).json({error: err});
		});
};


// === POST product === //
exports.products_create_product = (req, res, next) => {
	
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});

	product
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: 'Successfully created a product!',
				createdProduct: {
					_id: result._id,
					name: result.name,
					price: result.price,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + result._id
					}
				}
			});
		})
		.catch(err => {
			res.status(500).json({error: err});
		});
};

// === PATCH product by ID === //
exports.products_edit_product = (req, res, next) => {
	const id = req.params.productId;
	// creating an object to then pass to $set. This gives the choice of what to update.
	const updateOps = {};
	// request body will be sent as an array (array because we may want to update multiple fields of that particular data)
	for (const ops of req.body) {
		// append to the updateOps object with key value pair. After, will then be passed to the update method below.
		updateOps[ops.propName] = ops.value;
	}
	// find by id and then apply the updates to that selected data
	Product.update({ _id: id }, { $set: updateOps }) 
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Product updated!",
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + id
				}
			});
		})
		.catch(err => {
			res.status(500).json({error: err});
		});
};


// === DELETE product by ID === //
exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product deleted!',
				request: {
					type: 'POST',
					url: 'http://localhost:3000/products',
					body: { name: 'String', price: 'Number'}
				}
			});
		})
		.catch(err => {
			console.log(error);
			res.status(500).json({error: err});
		});
};