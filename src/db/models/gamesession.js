"use strict";
module.exports = (sequelize, DataTypes) => {
	var GameSession = sequelize.define(
		"GameSession",
		{
			points: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			gameId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{}
	);
	GameSession.associate = function (models) {
		GameSession.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "CASCADE",
		});
		GameSession.belongsTo(models.Game, {
			foreignKey: "gameId",
			as: "questions",
		});
	};
	return GameSession;
};
