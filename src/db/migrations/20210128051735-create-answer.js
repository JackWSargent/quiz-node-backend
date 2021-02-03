"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Answers", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			content: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				onDelete: "CASCADE",
				reference: {
					model: "Users",
					key: "id",
					as: "userId",
				},
			},
			gameId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				onDelete: "CASCADE",
				reference: {
					model: "Games",
					key: "id",
					as: "gameId",
				},
			},
			questionId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				onDelete: "CASCADE",
				reference: {
					model: "Questions",
					key: "id",
					as: "questionId",
				},
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Answers");
	},
};
