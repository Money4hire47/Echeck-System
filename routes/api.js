const express = require("express");
const router = express.Router();

const userauthRoutes = require("./userauth");
const accountRoutes = require("./useraccount");
const companyRoutes = require("./user-company");
const bankRoutes = require("./user-bank");
const checkRoutes = require("./user-check");
const recieverRoutes = require("./reciever");



router.use("/auth", userauthRoutes);
router.use("/account", accountRoutes);
router.use("/reciever", recieverRoutes);
router.use("/bank", bankRoutes);
router.use("/company", companyRoutes);
router.use("/check", checkRoutes);


module.exports = router
