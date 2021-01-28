const gameQueries = require("../db/queries.game.js");
const Authorizer = require("../policies/game");
const collaborator = require("../db/models").Collaborator;
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
			let newgame = {
				name: req.body.name,
				userId: req.body.user.id,
			};
			gameQueries.addGame(newgame, (err, game) => {
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
	destroy(req, res, next) {
		gameQueries.deleteGame(req, (err, game) => {
			if (err) {
				res.status(401).send(JSON.stringify(err));
			} else {
				res.status(200).send("Successfully Deleted");
			}
		});
	},
	update(req, res, next) {
		gameQueries.updategame(req, req.body, (err, game) => {
			if (err || game == null) {
				res.status(401).send(JSON.stringify(err));
			} else {
				res.status(200).send(JSON.stringify(game));
			}
		});
	},
};
