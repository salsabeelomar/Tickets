'use strict';
module.exports = (sequelize, DataTypes) => {
  const SupportStaff = sequelize.define('SupportStaff', {
    adminId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    status: DataTypes.ENUM
  }, {});
  SupportStaff.associate = function(models) {
    // associations can be defined here
  };
  return SupportStaff;
};