module.exports = {
	validateUsers(req, res, next) {
		console.log("body: ", req.body);
		console.log("params", req.params);
		if (req.method === "POST") {
			req.checkBody("username", "must be atleast 4 characters in length").isLength({ min: 4 });
			// req.checkBody("email", "must be valid").isEmail();
			req.checkBody("password", "must be at least 6 characters in length").isLength({ min: 6 });
			req.checkBody("passwordConfirmation", "must match password provided").optional().matches(req.body.password);
		}
		const errors = req.validationErrors();
		console.log(errors);
		if (errors) {
			return res.status(401).send("Not authorized");
		} else {
			return next();
		}
	},
};
