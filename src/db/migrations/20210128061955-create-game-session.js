"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("GameSessions", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
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
			points: {
				type: Sequelize.INTEGER,
				defaultValue: 0,
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
		await queryInterface.dropTable("GameSessions");
	},
};
