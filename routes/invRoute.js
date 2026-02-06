const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validate = require("../utilities/inventory-validation")

/* ***************************
 * PUBLIC ROUTES (PAS PROTÉGÉES)
 * *************************** */

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

// Récupérer l'inventaire en JSON (AJAX)
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************
 * MANAGEMENT ROUTES
 * Employee / Admin ONLY
 * *************************** */

// Vue de gestion inventory
router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagementView)
)

/* ===== CLASSIFICATION ===== */

// Afficher le formulaire d'ajout de classification
router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Traiter l'ajout de classification
router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ===== INVENTORY ===== */

// Afficher le formulaire d'ajout d'inventaire
router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Traiter l'ajout d'inventaire
router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Afficher le formulaire de modification
router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

// Traiter la modification
router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router

