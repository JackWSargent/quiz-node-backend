"use strict";
module.exports = (sequelize, DataTypes) => {
	var Question = sequelize.define(
		"Question",
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
			answerId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{}
	);
	Question.associate = function (models) {
		Question.belongsTo(models.User, {
			foreignKey: "userId",
			onDelete: "CASCADE",
		});
		Question.belongsTo(models.Game, {
			foreignKey: "gameId",
			onDelete: "CASCADE",
		});
		Question.hasOne(models.Answer, {
			foreignKey: "answerId",
			onDelete: "CASCADE",
		});
		Game.addScope("getAnswer", (questionId) => {
			return {
				include: [
					{
						model: models.Answer,
					},
				],
				where: { questionId: questionId },
				order: [["createdAt", "DESC"]],
			};
		});
	};
	return Question;
};
