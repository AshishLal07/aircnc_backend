const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
	try {
		let token = req.header('Authorization');
		// console.log(token);
		if (!token) {
			return res.status(403).send('Access denied');
		}
		// console.log(token.startsWith('Bearer '));
		if (token.startsWith('Bearer ')) {
			token = token.slice(7, token.length).trimLeft();
		}
		// console.log('final', token);
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
