const jwt = require('jsonwebtoken');
require('dotenv').config();
const authToken = process.env.AUTH_TOKEN;
console.log(process.env.AUTH_TOKEN, "this is the auth.js file")

module.exports = (req, res, next) => {
	console.log("function has been called !");
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, authToken);
		const userId = decodedToken.userId;
		req.auth = { userId };

		if (req.body.userId && req.body.userId !== userId) {
			throw "Une erreur s'est produite lors de l'autentification.";
		} else {
			next();
		}
	} catch {
		res.status(403).json({ error });
	}
};