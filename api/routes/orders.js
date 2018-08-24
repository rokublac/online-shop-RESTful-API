// jshint esversion:6
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


// =========== GET requests =========== //
router.get('/', (req, res, next) => {
	Order.find()
		.select('_id product quantity')
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				orders: docs.map(doc => {
					return {
						_id: doc._id,
						product: doc.product,
						quantity: doc.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/orders/' + doc._id
						}
					};
				}),
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});
});

router.get('/:orderId', (req, res, next) => {
	Order.findById(req.params.orderId)
		.select('_id product quantity')
		.exec()
		.then(order => {
			// check to see if order exists in database
			if (!order) {
				return res.status(404).json({
					message: "Order not found"
				});
			}
			res.status(200).json({
				order: order,
				request: {
					type: 'GET',
					description: 'GET_ALL_ORDERS',
					url: 'http://localhost:3000/orders'
				}
			});
		})
		.catch(err => {
			res.status(500).json({ error: "hi" });
		});
});

// =========== POST requests =========== //
router.post('/', (req, res, next) => {

	Product.findById(req.body.productId)
		.then(product => {
			if (!product) {
				return res.status(404).json({
					message: "Product not found"
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
				product: req.body.productId
			});
			// only return save to db function since to prevent triangle of death promise nesting
			return order.save();
			
		})
		.then(result => {
			res.status(201).json({
				message: "Order stored!",
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id
				}
			});
		})
		.catch(err => {
			res.status(500).json({ error: err });
		});	
});

// =========== DELETE requests =========== //
router.delete('/:orderId', (req, res, next) => {
	Order.remove({ _id: req.params.orderId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Order deleted!',
				requests: {
					type: 'POST',
					description: "POST_ORDERS",
					url: "http://localhost:3000/orders",
					body: {
						productid: "ID",
						quantity: "Number"
					}
				}
			});
		})
		.catch(err => {

		});
});

module.exports = router;