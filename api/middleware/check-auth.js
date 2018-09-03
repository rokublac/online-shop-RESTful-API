// jshint esversion:6
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
	try {
		 // White space split to get only token since header is sent as "Bearer <token>"
		const token = req.headers.authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY);
		req.userData = decoded;
	} catch (err) {
		return res.status(401).json({
			message: "Auth failed"
		});
	}
	next();
};