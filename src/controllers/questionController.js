const questionQueries = require("../db/queries.question.js");
const Authorizer = require("../policies/question");
// const collaborator = require("../db/models").Collaborator;
module.exports = {
	index(req, res, next) {
		questionQueries.getAllQuestions((err, questions) => {
			if (err) {
				res.status(401).send(JSON.stringify(err));
			} else {
				res.status(200).send(JSON.stringify(questions));
			}
		});
	},
	create(req, res, next) {
		const authorized = new Authorizer(req.body.user).create();
		if (authorized || true) {
			let newQuestion = {
				content: req.body.content,
				userId: req.body.userId,
				gameId: req.body.gameId,
				answerId: req.body.answerId,
			};
			questionQueries.addQuestion(newQuestion, (err, question) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(question));
				}
			});
		} else {
			res.status(401).send("Not authorized");
		}
	},
	update(req, res, next) {
		const authorized = new Authorizer(req.body.user).update();
		if (authorized) {
			questionQueries.updateQuestion(req, (err, question) => {
				if (err || question == null) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(question));
				}
			});
		} else {
			res.status(401).send("Not authorized");
		}
	},
	destroy(req, res, next) {
		const authorized = new Authorizer(req.body.user).destroy();
		if (authorized) {
			questionQueries.deleteQuestion(req, (err, question) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send("Successfully Deleted");
				}
			});
		} else {
			res.status(401).send("Not authorized");
		}
	},
};
