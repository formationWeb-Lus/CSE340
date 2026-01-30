const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/account-validation") // UN SEUL require

// Afficher les véhicules par classification
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Afficher les détails d'un véhicule
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildVehicleDetail)
)

// Vue de gestion
router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

/* Afficher le formulaire d'ajout de classification */

// afficher le formulaire
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// traiter le formulaire
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* Ajouter un nouvel inventaire */

// afficher le formulaire
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// traiter le formulaire
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

module.exports = router

