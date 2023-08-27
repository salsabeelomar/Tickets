'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    role: DataTypes.ENUM,
    birthday: DataTypes.DATE,
    isActive: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    lname: DataTypes.STRING,
    fnae: DataTypes.STRING,
    username: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};