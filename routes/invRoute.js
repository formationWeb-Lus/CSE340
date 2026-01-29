const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Afficher les véhicules par classification
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Afficher les détails d'un véhicule
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildVehicleDetail))

module.exports = router
