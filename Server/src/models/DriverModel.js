const { DataTypes } = require('sequelize');
const path = require('path');

module.exports = (sequelize) => {

  sequelize.define('Driver', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique:true,
    },

    forename: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
    },

    dob: {
      type: DataTypes.DATEONLY,
    },

    nationality: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.TEXT,
    },

    created: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },

  {
    timestamps: false,
    paranoid: true,
  }
  );
};