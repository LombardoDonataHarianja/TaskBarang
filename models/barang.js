'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Barang.init({
    no: DataTypes.INTEGER,
    nama_barang: DataTypes.STRING,
    stok: DataTypes.INTEGER,
    jumlah_terjual: DataTypes.INTEGER,
    tanggal_transaksi: DataTypes.DATE,
    jenis_barang: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Barang',
  });
  return Barang;
};