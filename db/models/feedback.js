'use strict';
module.exports = (sequelize, DataTypes) => {
  const feedback = sequelize.define('feedback', {
    ticketId: DataTypes.INTEGER,
    feedback: DataTypes.STRING,
    rating: DataTypes.INTEGER
  }, {});
  feedback.associate = function(models) {
    // associations can be defined here
  };
  return feedback;
};