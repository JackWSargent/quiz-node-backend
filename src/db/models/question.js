("use strict");
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
				allowNull: true,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			options: {
				type: DataTypes.STRING,
				get: function () {
					return JSON.parse(this.getDataValue("options"));
				},
				set: function (val) {
					return this.setDataValue("options", JSON.stringify(val));
				},
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
		Question.addScope("getAnswer", (questionId) => {
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
