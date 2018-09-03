// jshint esversion:6
const express = require('express');
const router = express.Router();
// authentication middleware
const checkAuth = require('../middleware/check-auth');
// controllers
const OrdersController = require('../controllers/orders-controller');


// =========== GET requests =========== //
router.get('/', checkAuth, OrdersController.orders_get_all);
router.get('/:orderId', checkAuth, OrdersController.orders_get_by_id);

// =========== POST requests =========== //
router.post('/', checkAuth, OrdersController.orders_post_order);

// =========== DELETE requests =========== //
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order);


module.exports = router;