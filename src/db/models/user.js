"use strict";
module.exports = (sequelize, DataTypes) => {
	var User = sequelize.define(
		"User",
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			points: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		},
		{}
	);
	User.associate = function (models) {
		User.hasMany(models.Game, {
			foreignKey: "userId",
			as: "games",
		});
		User.hasMany(models.Question, {
			foreignKey: "userId",
			as: "questions",
		});
		User.hasMany(models.Answer, {
			foreignKey: "userId",
			as: "answers",
		});
		User.addScope("users", () => {
			return {
				include: [
					{
						model: models.User,
					},
				],
				order: [["points", "DESC"]],
			};
		});
		// User.hasMany(models.Collaborator, {
		//   foreignKey: 'userId',
		//   as: 'collaborators'
		// });
		User.prototype.isAdmin = () => {
			return this.role == 1;
		};
		User.prototype.isMember = () => {
			return this.role == 0;
		};
	};
	return User;
};
