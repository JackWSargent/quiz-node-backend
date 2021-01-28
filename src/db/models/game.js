"use strict";
module.exports = (sequelize, DataTypes) => {
	var Game = sequelize.define(
		"Game",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			ownerId: {
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
		Game.addScope("getQuestions", (gameId) => {
			return {
				include: [
					{
						model: models.Question,
					},
				],
				where: { gameId: gameId },
				order: [["createdAt", "DESC"]],
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
				order: [["createdAt", "DESC"]],
			};
		});
	};
	return Game;
};
