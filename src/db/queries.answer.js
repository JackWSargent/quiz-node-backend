const Answer = require("./models").Answer;
const Authorizer = require("../policies/answer.js");
module.exports = {
	getAllAnswers(callback) {
		Answer.findAll()
			.then((answers) => {
				callback(null, answers);
			})
			.catch((err) => {
				console.log("error : " + err);
				callback(err);
			});
	},
	addAnswer(newAnswer, callback) {
		return Answer.create({
			content: newAnswer.content,
			userId: newAnswer.userId,
		})
			.then((answer) => {
				callback(null, answer);
			})
			.catch((err) => {
				console.log("error reached in query " + err);
				callback(err);
			});
	},
	getAnswer(id, callback) {
		let results = {};
		return Answer.findByPk(id)
			.then((answer) => {
				if (!answer) {
					callback(404);
				} else {
					results["answer"] = answer;
					// Collaborator.scope({ method: ["collaborators", id] })
					// 	.findAll()
					// 	.then((collaborators) => {
					// 		results["collaborators"] = collaborators;
					// 		callback(null, results);
					// 	})
					// 	.catch((err) => {
					// 		console.log(err);
					// 	});
				}
			})
			.catch((err) => {
				console.log("could not find it");
				console.log(err);
				callback(err);
			});
	},
	deleteAnswer(req, callback) {
		//console.log("in query");
		return Answer.findByPk(req.params.id)
			.then((answer) => {
				//console.log("found answer");
				const authorized = new Authorizer(req.user, answer).destroy();
				if (authorized) {
					answer.destroy().then((res) => {
						//console.log("answer destroyed");
						callback(null, answer);
					});
				} else {
					//console.log("not authorized");
					callback(401);
				}
			})
			.catch((err) => {
				//console.log("did not find question");
				callback(err);
			});
	},
	updateAnswer(req, callback) {
		return Answer.findByPk(req.params.id).then((answer) => {
			if (!answer) {
				return callback("Answer not found");
			}
			const user = req.user ? req.user : req.body.user;
			const authorized = new Authorizer(user, answer).update();
			if (authorized) {
				answer
					.update(req.body.answer, {
						fields: Object.keys(req.body.answer),
					})
					.then((res) => {
						callback(null, res);
					})
					.catch((err) => {
						callback(err);
					});
			} else {
				callback("Forbidden");
			}
		});
	},
};
