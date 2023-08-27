'use strict';
module.exports = (sequelize, DataTypes) => {
  const ticketStatus = sequelize.define('ticketStatus', {
    status: DataTypes.ENUM
  }, {});
  ticketStatus.associate = function(models) {
    // associations can be defined here
  };
  return ticketStatus;
};