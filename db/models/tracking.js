'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tracking = sequelize.define('Tracking', {
    statusId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER,
    staffId: DataTypes.INTEGER,
    ticketId: DataTypes.INTEGER,
    comments: DataTypes.STRING,
    scheduleFor: DataTypes.DATE
  }, {});
  Tracking.associate = function(models) {
    // associations can be defined here
  };
  return Tracking;
};