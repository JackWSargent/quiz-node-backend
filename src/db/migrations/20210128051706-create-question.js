"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Questions", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			content: {
				type: Sequelize.STRING,
				allowNull: false,
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
			answerId: {
				type: Sequelize.INTEGER,
				allowNull: true,
				onDelete: "CASCADE",
				reference: {
					model: "Answers",
					key: "id",
					as: "answerId",
				},
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("Questions");
	},
};
