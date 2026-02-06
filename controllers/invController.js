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
/* ***************************
 * Build vehicle detail view
 ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = parseInt(req.params.inv_id)

    const vehicle = await invModel.getVehicleById(vehicleId)

    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" })
    }

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
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      message: req.flash("notice")
    })
  } catch (error) {
    console.error("❌ Error in buildManagementView:", error)
    next(error)
  }
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
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("notice", "Classification added successfully.")
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList()

      res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect,
        message: req.flash("notice")
      })
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error)
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()

  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect =
    await utilities.buildClassificationList(itemData.classification_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  // Appel à la fonction du modèle qui fait la mise à jour dans la DB
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

module.exports = invCont
