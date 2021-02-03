const gameQueries = require("../db/queries.game.js");
const questionQueries = require("../db/queries.question.js");
const answerQueries = require("../db/queries.answer.js");
const Authorizer = require("../policies/game");
module.exports = {
	index(req, res, next) {
		gameQueries.getAllGames((err, games) => {
			if (err) {
				res.status(401).send(JSON.stringify(err));
			} else {
				res.status(200).send(JSON.stringify(games));
			}
		});
	},
	buildGame(req, res, next) {
		const info = req.body;
		const auth1 = new Authorizer(info.user).create();
		const auth2 = new Authorizer(info.user).update();
		const auth3 = new Authorizer(info.user).destroy();
		if(auth1 && auth2 && auth3){
			const newGame = {name: info.game.name, userId: info.user.id}
			/* 1. Create Game
			*  2. Create Question
			*  3. Create Answer w/Question ID
			*  4. Update Question w/Answer ID
			*  5. Return Game with Questions and Answers
			*/ 
			gameQueries.addGame(newGame, (err, game) => {
				if(err){
					return res.status(400).send("Unable to create game")
				} else {
					console.log("Game " + info.game.name + " has been created");
					for(let i = 0; i < info.questions.length; i++){
						let currentQuestion = info.questions[i];
						let currentAnswer = info.answers[i];
						let newQuestion = {
							content = currentQuestion.content,
							userId = info.user.id,
							gameId = game.id,
						}
						questionQueries.addQuestion(newQuestion, (err, question) => {
							if(err){
								return res.status(400).send("Unable to create question")
							} else {
								let newAnswer = {
									content = currentAnswer.content,
									userId = info.user.id,
									gameId = game.id,
									questionId = question.id
								}
								answerQueries.addAnswer(newAnswer, (err, answer) => {
									if(err){
										return res.status(400).send('Unable to create answer')
									} else {
										let questionAndAnswer = {
											...question, answerId: answer.id
										}
										questionQueries.updateQuestion(questionAndAnswer, (err, updatedQuestion) => {
											if(err) {
												return res.status(400).send('Unable to update question')
											}
										})
									}
								})
							}
						})
					}
					info.questions.forEach(question => {
						let newQuestion = {
							content = question.content,
							userId = info.user.id,
							gameId = newGame.id,
						}
						
					})
					info.answers.forEach(answer => {
						let newAnswer = {
							content: answer.content,
							userId: info.user.id,
							gameId: newGame.id,
						}
						answerQueries.addAnswer()
					})
				}
			})
		}
	},
	getGame(req, res, next) {
		const authorized = new Authorizer(req.body.user).getGame();
		if (authorized) {
			gameQueries.getGame(req, (err, game) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(game));
				}
			});
		}
	},
	create(req, res, next) {
		const authorized = new Authorizer(req.body.user).create();
		if (authorized || true) {
			let newGame = {
				name: req.body.name,
				userId: req.body.userId,
			};
			gameQueries.addGame(newGame, (err, game) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(game));
				}
			});
		} else {
			res.status(401).send("You are not authorized to do that");
		}
	},
	update(req, res, next) {
		const authorized = new Authorizer(req.body.user).update();
		if (authorized) {
			gameQueries.updateGame(req, (err, game) => {
				if (err || game == null) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send(JSON.stringify(game));
				}
			});
		}
	},
	destroy(req, res, next) {
		const authorized = new Authorizer(req.body.user).destroy();
		if (authorized) {
			gameQueries.deleteGame(req, (err, game) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send("Successfully Deleted");
				}
			});
		}
	},
};
