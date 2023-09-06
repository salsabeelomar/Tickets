'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'trackings',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          statusId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'ticket_status',
              key: 'id',
            },
          },
          adminId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          assignmentId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'assignment_tickets',
              key: 'id',
            },
          },
          ticketId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'tickets',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          comments: {
            type: Sequelize.STRING,
            defaultValue: false,
          },
          scheduleFor: {
            type: Sequelize.DATE,
          },
          sendEmail: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            type: Sequelize.DATE,
          },
        },
        { transaction: t },
      );
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('trackings', { transaction: t });
    });
  },
};
