const userQueries = require("../db/queries.user.js");
const passport = require("passport");
module.exports = {
	create(req, res, next) {
		const newUser = {
			username: req.body.username,
			password: req.body.password,
			passwordConfirmation: req.body.passwordConfirmation,
		};
		userQueries.createUser(newUser, (err, user) => {
			if (err) {
				res.status(401).send(JSON.stringify(err));
			} else {
				passport.authenticate("local")(req, res, () => {
					res.status(200).send("Successful Sign Up");
				});
			}
		});
	},
	signIn(req, res, next) {
		passport.authenticate("local")(req, res, function () {
			if (!req.user) {
				res.status(401).send("Failed Sign In");
			} else {
				res.status(200).send(JSON.stringify(req.user));
			}
		});
	},
	signOut(req, res, next) {
		req.logout();
	},
	retrieveUsers(req, res, next) {
		userQueries.getAllUsers(users, (err, user) => {
			if (err) {
				res.status(400).send(JSON.stringify(err));
			} else {
				res.status(200).send(JSON.stringify(users));
			}
		});
	},
};
