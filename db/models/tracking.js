'use strict';
module.exports = (sequelize, DataTypes) => {
  const tracking = sequelize.define('tracking', {
    assignmentId: DataTypes.INTEGER
  }, {});
  tracking.associate = function(models) {
    // associations can be defined here
  };
  return tracking;
};