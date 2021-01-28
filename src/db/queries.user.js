const User = require("./models").User;
module.exports = {
	createUser(newUser, callback) {
		const salt = bcrypt.genSaltSync();
		const hashedPassword = bcrypt.hashSync(newUser.password, salt);
		return User.create({
			username: newUser.username,
			password: hashedPassword,
		})
			.then((user) => {
				callback(null, user);
			})
			.catch((err) => {
				callback(err);
			});
	},
	getUser(id, callback) {
		let result = {};
		User.findByPk(id).then((user) => {
			if (!user) {
				callback(404);
			} else {
				result["user"] = user;
				// Collaborator.scope({ method: ["collaborator", id] })
				// 	.findAll()
				// 	.then((collaborator) => {
				// 		result["collaborator"] = collaborator;
				// 		callback(null, result);
				// 	})
				// 	.catch((err) => {
				// 		callback(err);
				// 	});
			}
		});
	},
	getAllUsers(callback) {
		return User.findAll()
			.then((users) => {
				callback(null, users);
			})
			.catch((err) => {
				console.log("error : " + err);
				callback(err);
			});
	},
	upgradeToPremium(id) {
		return User.findByPk(id)
			.then((user) => {
				if (user) {
					return user.update({ role: 1 });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	},
	downgradeToFree(id) {
		return User.findByPk(id)
			.then((user) => {
				if (user) {
					return user.update({ role: 0 });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	},
};
