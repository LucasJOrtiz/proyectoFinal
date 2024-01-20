const { Router } = require("express");
const router = Router();

const getRoutes = require ("./getRoutes")
const postRoutes = require ("./postRoutes")

router.use("/", getRoutes);
console.log('Uploading GET routes');

router.use("/", postRoutes);
console.log('Uploading POST routes');

module.exports = router;
