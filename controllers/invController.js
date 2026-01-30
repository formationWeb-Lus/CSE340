const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 * Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classificationId = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classificationId)
    const nav = await utilities.getNav()

    if (!data || data.length === 0) {
      return res.render("./inventory/classification", {
        title: "No vehicles found",
        nav,
        grid: '<p class="notice">Sorry, no matching vehicles could be found.</p>'
      })
    }

    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build vehicle detail view
 ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.inv_id
    const result = await invModel.getVehicleById(vehicleId)

    if (result.rows.length === 0) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const vehicle = result.rows[0]
    const nav = await utilities.getNav()
    const vehicleHTML = await utilities.buildVehicleDetail(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build management view
 ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("notice")
  })
}

/* ***************************
 * Build add classification form
 ************************** */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    message: req.flash("notice")
  })
}

/* ***************************
 * Handle add classification POST
 ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", "Classification added successfully.")
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("notice")
    })
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    res.redirect("/inv/add-classification")
  }
}

/* ***************************
 * Build add inventory form
 ************************** */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    // 👇 variables initialisées pour éviter les erreurs dans EJS
    inv_make: ' exp: FBI',
    inv_model: 'exp: Surveillance Van',
    inv_year: 'exp:year 2016 ',
    inv_description: 'exp: Do you like police...',
    inv_image: '/images/vehicles/no-image.png',
    inv_thumbnail: '/images/vehicles/no-image.png',
    inv_price: 'exp: 20000 ',
    inv_miles: '19851',
    inv_color: 'Brown',
    classification_id: ''
  })
}

/* ***************************
 * Handle add inventory POST
 ************************** */
invCont.addInventory = async function (req, res) {
  try {
    const result = await invModel.addInventory(req.body)

    if (result) {
      req.flash("notice", "Inventory item added successfully.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Error adding inventory item.")
      // renvoyer le formulaire avec persistance et messages
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(req.body.classification_id)

      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList,
        errors: [{ msg: "Error adding inventory item." }],
        ...req.body // 🔥 persistance
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
