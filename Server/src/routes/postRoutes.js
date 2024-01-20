const { Router } = require("express");

const postRoutes = Router();

const { createDriverHandler } =require ("../handlers/driverHandlers")

postRoutes.post ("/drivers", createDriverHandler);

module.exports = postRoutes;