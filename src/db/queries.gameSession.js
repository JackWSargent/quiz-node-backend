const GameSession = require("./models").GameSession;
const Authorizer = require("../policies/gameSession.js");
module.exports = {
	getAllGameSessions(callback) {
		GameSession.findAll()
			.then((gameSessions) => {
				callback(null, gameSessions);
			})
			.catch((err) => {
				console.log("error : " + err);
				callback(err);
			});
	},
	addGameSession(newGameSession, callback) {
		return GameSession.create({
			name: newGameSession.name,
			userId: newGameSession.userId,
		})
			.then((gameSession) => {
				callback(null, gameSession);
			})
			.catch((err) => {
				console.log("error reached in query " + err);
				callback(err);
			});
	},
	getGameSession(id, callback) {
		let results = {};
		return GameSession.findByPk(id)
			.then((gameSession) => {
				if (!gameSession) {
					callback(404);
				} else {
					results["gameSession"] = gameSession;
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
	deleteGameSession(req, callback) {
		//console.log("in query");
		return GameSession.findByPk(req.params.id)
			.then((gameSession) => {
				//console.log("found gameSession");
				const authorized = new Authorizer(req.user, gameSession).destroy();
				if (authorized) {
					gameSession.destroy().then((res) => {
						//console.log("Game destroyed");
						callback(null, gameSession);
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
	updateGameSession(req, callback) {
		return GameSession.findByPk(req.params.id).then((gameSession) => {
			if (!gameSession) {
				return callback("gameSession not found");
			}
			const user = req.user ? req.user : req.body.user;
			const authorized = new Authorizer(req.user, gameSession).update();
			if (authorized) {
				gameSession
					.update(req.body.gameSession, {
						fields: Object.keys(req.body.gameSession),
					})
					.then(() => {
						callback(null, gameSession);
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
