const Game = require("./models").Game;
const Authorizer = require("../policies/game.js");
module.exports = {
	getAllGames(callback) {
		Game.findAll()
			.then((games) => {
				callback(null, games);
			})
			.catch((err) => {
				console.log("error : " + err);
				callback(err);
			});
	},
	addGame(newGame, callback) {
		return Game.create({
			name: newGame.name,
			userId: newGame.userId,
		})
			.then((game) => {
				callback(null, game);
			})
			.catch((err) => {
				console.log("error reached in query " + err);
				callback(err);
			});
	},
	getGame(req, callback) {
		let results = {};
		return Game.findByPk(req.params.id)
			.then((game) => {
				if (!game) {
					callback(404);
				} else {
					results["game"] = game;
					Game.scope({ method: ["getQuestions", req.params.id] })
						.findAll()
						.then((questions) => {
							results["questions"] = questions;
							callback(null, results);
						})
						.catch((err) => {
							console.log(err);
						});
				}
			})
			.catch((err) => {
				console.log("could not find it");
				console.log(err);
				callback(err);
			});
	},
	updateGame(req, callback) {
		return Game.findByPk(req.params.id).then((game) => {
			if (!game) {
				return callback("Game not found");
			}
			const user = req.user ? req.user : req.body.user;
			const authorized = new Authorizer(user, game).update();
			if (authorized) {
				game.update(req.body.game, {
					fields: Object.keys(req.body.game),
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
	deleteGame(req, callback) {
		//console.log("in query");
		return Game.findByPk(req.params.id)
			.then((game) => {
				//console.log("found game");
				const authorized = new Authorizer(req.user, game).destroy();
				if (authorized) {
					game.destroy().then((res) => {
						//console.log("game destroyed");
						callback(null, game);
					});
				} else {
					//console.log("not authorized");
					callback(401);
				}
			})
			.catch((err) => {
				//console.log("did not find Game");
				callback(err);
			});
	},
};
