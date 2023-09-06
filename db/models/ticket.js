'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticket = sequelize.define('ticket', {
    title: DataTypes.STRING
  }, {});
  ticket.associate = function(models) {
    // associations can be defined here
  };
  return ticket;
};