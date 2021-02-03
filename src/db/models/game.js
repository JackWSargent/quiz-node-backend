"use strict";
module.exports = (sequelize, DataTypes) => {
	var Game = sequelize.define(
		"Game",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{}
	);
	Game.associate = function (models) {
		Game.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "CASCADE",
		});
		Game.hasMany(models.Question, {
			foreignKey: "gameId",
			as: "questions",
		});
		Game.hasMany(models.Answer, {
			foreignKey: "gameId",
			as: "answers",
		});
		Game.hasMany(models.GameSession, {
			foreignKey: "gameId",
			as: "gameSessions",
		});
		Game.addScope("getQuestions", (gameId) => {
			return {
				include: [
					{
						model: models.Question,
					},
				],
				where: { gameId: gameId },
				order: [["id", "ASC"]],
			};
		});
		Game.addScope("getAnswers", (gameId) => {
			return {
				include: [
					{
						model: models.Answer,
					},
				],
				where: { gameId: gameId },
				order: [["createdAt", "ASC"]],
			};
		});
		Game.addScope("getQuestionsAndAnswers", (gameId) => {
			return {
				include: [
					{
						model: models.Question,
					},
					{
						model: models.Answer,
					},
				],
				where: {
					gameId: gameId,
				},
				order: [["createdAt", "ASC"]],
			};
		});
	};
	return Game;
};
