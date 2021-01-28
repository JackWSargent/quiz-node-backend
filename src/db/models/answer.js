"use strict";
module.exports = (sequelize, DataTypes) => {
	var Answer = sequelize.define(
		"Answer",
		{
			content: {
				type: DataTypes.STRING,
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
			questionId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{}
	);
	Answer.associate = function (models) {
		Answer.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "CASCADE",
		});
		Answer.belongsTo(models.Game, {
			foreignKey: "gameId",
			onDelete: "CASCADE",
		});
		Answer.belongsTo(models.Question, {
			foreignKey: "questionId",
			onDelete: "CASCADE",
		});
	};
	return Answer;
};
