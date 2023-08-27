'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tickets = sequelize.define('Tickets', {
    statusId: DataTypes.INTEGER,
    adminId: DataTypes.INTEGER,
    staffId: DataTypes.INTEGER,
    prioritize: DataTypes.ENUM,
    category: DataTypes.ENUM,
    isConfirm: DataTypes.BOOLEAN,
    tag: DataTypes.STRING,
    titel: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Tickets.associate = function(models) {
    // associations can be defined here
  };
  return Tickets;
};