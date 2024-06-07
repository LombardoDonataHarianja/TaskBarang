// controllers/barang-controller.js
const { Barang } = require("../models/index");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

class BarangController {
  static async getItem(req, res, next) {
    try {
      let barangs = await Barang.findAll({
        order: [["id", "ASC"]],
      });
      res.status(200).json(barangs);
    } catch (err) {
      next(err);
    }
  }

  static async getItemByPk(req, res, next) {
    try {
      const id = +req.params.id;
      let barang = await Barang.findByPk(id);
      if (!barang) {
        return res.status(404).json({ message: "Barang not found" });
      }
      res.status(200).json(barang);
    } catch (err) {
      next(err);
    }
  }

  static async addItem(req, res, next) {
    try {
      const {
        no,
        nama_barang,
        stok,
        jumlah_terjual,
        tanggal_transaksi,
        jenis_barang,
      } = req.body;
      let newBarang = await Barang.create({
        no,
        nama_barang,
        stok,
        jumlah_terjual,
        tanggal_transaksi,
        jenis_barang,
      });
      res.status(201).json(newBarang);
    } catch (err) {
      next(err);
    }
  }

  static async editItem(req, res, next) {
    try {
      const id = +req.params.id;
      const {
        no,
        nama_barang,
        stok,
        jumlah_terjual,
        tanggal_transaksi,
        jenis_barang,
      } = req.body;
      let updated = await Barang.update(
        {
          no,
          nama_barang,
          stok,
          jumlah_terjual,
          tanggal_transaksi,
          jenis_barang,
        },
        { where: { id } }
      );
      if (updated[0] === 0) {
        return res.status(404).json({ message: "Barang not found" });
      }
      res.status(200).json({ message: "Barang updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteItem(req, res, next) {
    try {
      const id = +req.params.id;
      let deleted = await Barang.destroy({ where: { id } });
      if (deleted === 0) {
        return res.status(404).json({ message: "Barang not found" });
      }
      res.status(200).json({ message: "Barang deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async getItemSort(req, res, next) {
    try {
      let { search, sortBy } = req.query;

      // Define sorting options
      let sortOptions = [];
      if (sortBy === "nama_barang") {
        sortOptions.push(["nama_barang", "ASC"]);
      } else if (sortBy === "tanggal_transaksi") {
        sortOptions.push(["tanggal_transaksi", "ASC"]);
      }

      // Define search options
      let searchOptions = {};
      if (search) {
        searchOptions = {
          where: {
            [Op.or]: [
              { nama_barang: { [Op.iLike]: `%${search}%` } },
              { tanggal_transaksi: { [Op.iLike]: `%${search}%` } },
            ],
          },
        };
      }

      // Fetch items from the database with sorting and searching applied
      let barangs = await Barang.findAll({
        ...searchOptions,
        order: sortOptions,
      });

      res.status(200).json(barangs);
    } catch (error) {
      next(error); // Forward the error to the error handling middleware
    }
  }

  static async compareTransactions(req, res, next) {
    try {
      let { type, mode, startDate, endDate } = req.query;

      console.log("Received type:", type); // Debugging line
      console.log("Received mode:", mode); // Debugging line
      console.log("Received startDate:", startDate); // Debugging line
      console.log("Received endDate:", endDate); // Debugging line

      if (!type || !mode) {
        return res
          .status(400)
          .json({ message: "Type and mode parameters are required" });
      }

      if (mode !== "highest" && mode !== "lowest") {
        return res.status(400).json({
          message: "Invalid mode parameter. Should be 'highest' or 'lowest'",
        });
      }

      // Validate date range
      let dateFilter = {};
      if (startDate && endDate) {
        dateFilter = {
          tanggal_transaksi: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        };
      } else if (startDate) {
        dateFilter = {
          tanggal_transaksi: {
            [Op.gte]: new Date(startDate)
          }
        };
      } else if (endDate) {
        dateFilter = {
          tanggal_transaksi: {
            [Op.lte]: new Date(endDate)
          }
        };
      }

      let transactions = await Barang.findAll({
        where: {
          jenis_barang: type,
          ...dateFilter
        },
        order: [["jumlah_terjual", mode === "highest" ? "DESC" : "ASC"]],
      });

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error:", error);
      next(error);
    }
  }
}

module.exports = BarangController;
