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
	addWiki(newGame, callback) {
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
	getGame(id, callback) {
		let results = {};
		return Game.findByPk(id)
			.then((game) => {
				if (!game) {
					callback(404);
				} else {
					results["game"] = game;
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
	deleteGame(req, callback) {
		//console.log("in query");
		return Game.findByPk(req.params.id)
			.then((Game) => {
				//console.log("found Game");
				const authorized = new Authorizer(req.user, Game).destroy();
				if (authorized) {
					Game.destroy().then((res) => {
						//console.log("Game destroyed");
						callback(null, Game);
					});
				} else {
					//console.log("not authorized");
					req.flash("notice", "You are not authorized to do that.");
					callback(401);
				}
			})
			.catch((err) => {
				//console.log("did not find Game");
				callback(err);
			});
	},
	updateGame(req, updatedGame, callback) {
		return Game.findByPk(req.params.id).then((game) => {
			if (!game) {
				return callback("game not found");
			}
			const authorized = new Authorizer(req.user, game).update();
			if (authorized) {
				game.update(updatedGame, {
					fields: Object.keys(updatedGame),
				})
					.then(() => {
						callback(null, game);
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
