const gameSessionQueries = require("../db/queries.gameSession.js");
const Authorizer = require("../policies/gameSession");
// const collaborator = require("../db/models").Collaborator;
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
	create(req, res, next) {
		const authorized = new Authorizer(req.body.user).create();
		if (authorized) {
			let newGameSession = {
				name: req.body.name,
				userId: req.body.user.id,
			};
			gameSessionQueries.addGame(newGameSession, (err, game) => {
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
			gameSessionQueries.updateGameSession(req, (err, game) => {
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
			gameSessionQueries.deleteGameSession(req, (err, game) => {
				if (err) {
					res.status(401).send(JSON.stringify(err));
				} else {
					res.status(200).send("Successfully Deleted");
				}
			});
		}
	},
};
