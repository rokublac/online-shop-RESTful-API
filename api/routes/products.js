// jshint esversion:6
const express = require('express');
const router = express.Router();
const multer = require('multer'); // form parser middleware - multer is a library that parses the form in POST requests
const checkAuth = require('../middleware/check-auth'); // authentication middleware
const ProductsController = require('../controllers/products-controller'); // products route controller


// === Multer form parser middleware declarations === //
// custom strategy
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './uploads/');
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname);
	}
});

// custom file filter if needed
const fileFilter = (req, file, callback) => {
	// only accept jpeg and png files
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
		callback(null, true);
	} else {
		callback(null, false);
	}
};

// store all files from form submission in uploads folder
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5, // if you want to have a file size limit (in this case 5MB)
	},
	fileFilter: fileFilter // our custom filter that only accepts jpeg and png files
}); 

// === END multer declarations === //

// =========== GET requests =========== //
router.get('/', ProductsController.products_get_all);
router.get('/:productId', ProductsController.products_get_by_id);

// =========== POST requests =========== //
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

// =========== PATCH requests =========== //
router.patch('/:productId', checkAuth, ProductsController.products_edit_product);

// =========== DELETE requests =========== //
router.delete('/:productId', checkAuth, ProductsController.products_delete_product);


module.exports = router;