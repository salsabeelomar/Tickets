'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          role: {
            type: Sequelize.ENUM('Support_Staff', 'User', 'Admin'),
            defaultValue: 'User',
          },
          birthday: {
            type: Sequelize.DATE,
            allowNull: false,
          },

          isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
          },
          lname: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          fname: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          username: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          createdBy: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          updatedBy: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          deletedAt: {
            type: Sequelize.DATE,
          },
          deletedBy: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },
          },
        },
        { transaction: t },
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('users', { transaction: t });
    });
  },
};
