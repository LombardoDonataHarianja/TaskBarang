const express = require("express");
const router = express.Router();
const BarangController = require("../controllers/barang-controller");
const UserController = require("../controllers/user-controller")


router.get("/compare-transactions", BarangController.compareTransactions);
router.get("/", BarangController.getItemSort);
router.get("/", BarangController.getItem);
router.post("/", BarangController.addItem);
router.get("/:id", BarangController.getItemByPk);
router.put("/:id", BarangController.editItem);
router.delete("/:id", BarangController.deleteItem);

router.post("/register", UserController.register);
router.post("/login", UserController.login);


module.exports = router;