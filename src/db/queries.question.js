const Question = require("./models").Question;
const Authorizer = require("../policies/question.js");
module.exports = {
	getAllQuestions(callback) {
		Question.findAll()
			.then((questions) => {
				callback(null, questions);
			})
			.catch((err) => {
				console.log("error : " + err);
				callback(err);
			});
	},
	addQuestion(newQuestion, callback) {
		return Question.create({
			name: newQuestion.name,
			userId: newQuestion.userId,
		})
			.then((question) => {
				callback(null, question);
			})
			.catch((err) => {
				console.log("error reached in query " + err);
				callback(err);
			});
	},
	getQuestion(id, callback) {
		let results = {};
		return Question.findByPk(id)
			.then((question) => {
				if (!question) {
					callback(404);
				} else {
					results["question"] = question;
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
	deleteQuestion(req, callback) {
		//console.log("in query");
		return Question.findByPk(req.params.id)
			.then((question) => {
				//console.log("found question");
				const authorized = new Authorizer(req.user, question).destroy();
				if (authorized) {
					question.destroy().then((res) => {
						//console.log("question destroyed");
						callback(null, question);
					});
				} else {
					//console.log("not authorized");
					req.flash("notice", "You are not authorized to do that.");
					callback(401);
				}
			})
			.catch((err) => {
				//console.log("did not find question");
				callback(err);
			});
	},
	updateQuestion(req, updatedQuestion, callback) {
		return question.findByPk(req.params.id).then((question) => {
			if (!question) {
				return callback("question not found");
			}
			const authorized = new Authorizer(req.user, question).update();
			if (authorized) {
				question
					.update(updatedQuestion, {
						fields: Object.keys(updatedQuestion),
					})
					.then(() => {
						callback(null, question);
					})
					.catch((err) => {
						callback(err);
					});
			} else {
				req.flash("notice", "You are not authorized to do that.");
				callback("Forbidden");
			}
		});
	},
};
