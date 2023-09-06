('use strict');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'assignment_tickets',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          staffId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'support_staffs',
              key: 'id',
            },
          },
          adminId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          ticketId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'tickets',
              key: 'id',
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
        },
        { transaction: t },
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      queryInterface.dropTable('assignment_tickets', { transaction: t });
    });
  },
};
