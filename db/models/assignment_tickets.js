'use strict';
module.exports = (sequelize, DataTypes) => {
  const assignment_tickets = sequelize.define('assignment_tickets', {
    assignmentId: DataTypes.INTEGER
  }, {});
  assignment_tickets.associate = function(models) {
    // associations can be defined here
  };
  return assignment_tickets;
};