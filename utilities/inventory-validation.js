const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 * Classification Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage(
        "Classification name must contain only letters and numbers."
      ),
  ]
}

/* **********************************
 * Check Classification Data
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: errors.array(),
      classification_name: req.body.classification_name,
    })
  }
  next()
}

/* **********************************
 * Inventory Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make").notEmpty(),
    body("inv_model").notEmpty(),
    body("inv_year").isInt({ min: 1900 }),
    body("inv_price").isFloat({ min: 0 }),
    body("inv_miles").isInt({ min: 0 }),
    body("inv_color").notEmpty(),
    body("classification_id").notEmpty(),
  ]
}

/* **********************************
 * Check Inventory Data
 * ********************************* */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  let classificationList =
    await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    })
  }
  next()
}

/* **********************************
 * Check Inventory Data for Update (Edit View)
 ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)

  // Construire la liste des classifications pour la dropdown
  let classificationList =
    await utilities.buildClassificationList(req.body.classification_id)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/edit-inventory", { // <- vue d'édition
      title: "Edit " + req.body.inv_make + " " + req.body.inv_model, // même titre que le contrôleur
      nav,
      classificationList,
      errors: errors.array(),
      inv_id: req.body.inv_id, // <- important pour garder l'identifiant
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      classification_id: req.body.classification_id,
    })
  }
  next()
}


module.exports = validate