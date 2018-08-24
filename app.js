// jshint esversion:6
const express = require('express');
const morgan = require('morgan'); // Morgan is used for logging request details
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import routes
const orderRoutes = require('./api/routes/orders');
const productRoutes = require('./api/routes/products');


mongoose.connect('mongodb+srv://rokublak:12345@node-shop-jaewu.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

// create express app
const app = express();

// ========== MIDDLEWARES  ========== //

// console log out request details
app.use(morgan('dev'));
// set uploads folder to be publicly available. only target with prefix /uploads to get file
app.use('/uploads', express.static('uploads'));
// parse request body with body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// CORS errors prevention
app.use((req, res, next) => {
	// allow access for everyone
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	// every request will have an 'options' method to see if it can peform that request
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE','GET');
		return res.state(200).json({});
	}
	next();
});

// ========== ROUTES  ========== //

// home route - write something to page to prevent 404
app.use('/', (req, res, next) => {
	res.write('Hi there!');
	res.end();
});

// request routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// ========== ERROR HANDLERS  ========== //

// custom 404 handler
app.use((req, res, next) => {
	const error = new Error('Not found');
	error.status = 404;
	// pass on this error to the error handler below
	next(error);
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});


module.exports = app;