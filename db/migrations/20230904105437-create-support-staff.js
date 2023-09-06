'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'support_staffs',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          adminId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },

            as: 'admin',

            allowNull: true,
          },
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              as: 'staff',
              key: 'id',
            },
          },
          status: {
            type: Sequelize.ENUM('Pending', 'Accept', 'Decline'),
            defaultValue: 'Pending',
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
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
      await queryInterface.dropTable('support_staffs', { transaction: t });
    });
  },
};
