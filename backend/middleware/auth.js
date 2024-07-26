const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	console.log("function has been called !");
	try {
		const token = req.headers.authorization.split(' ')[1];
		const decodedToken = jwt.verify(token, 'TOKEN_SECRET=g$G_fR^%58UgTdPm^n478mp0hv@_7265a$%hdf?40zkjugefvNrf');
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