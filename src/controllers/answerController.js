const answerQueries = require("../db/queries.answer.js");
const Authorizer = require("../policies/answer");
// const collaborator = require("../db/models").Collaborator;
module.exports = {
	index(req, res, next) {
		const authorized = new Authorizer(req.body.user).show();
		if (authorized) {
			answerQueries.getAllAnswer((err, answers) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(answers));
				}
			});
		}
	},
	create(req, res, next) {
		const authorized = new Authorizer(req.body.user).create();
		if (authorized) {
			let newAnswer = {
				content: req.body.content,
				userId: req.body.user.id,
				gameId: req.body.game.id,
				questionId: req.body.question.id,
			};
			answerQueries.addAnswer(newAnswer, (err, answer) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(answer));
				}
			});
		} else {
			res.status(401).send("You are not authorized to do that");
		}
	},
	update(req, res, next) {
		const authorized = new Authorizer(req.body.user).update();
		if (authorized) {
			answerQueries.updateAnswer(req, (err, answer) => {
				if (err || answer == null) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(answer));
				}
			});
		}
	},
	destroy(req, res, next) {
		const authorized = new Authorizer(req.body.user).destroy();
		if (authorized) {
			answerQueries.deleteAnswer(req, (err, answer) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send("Successfully Deleted");
				}
			});
		}
	},
};
