const paymentModel = require("../models/payment-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const paymentCont = {}

// Build Payment View
paymentCont.buildPaymentView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    let nav = await utilities.getNav()

    // Récupérer le véhicule
    const vehicle = await invModel.getInventoryById(inv_id)
    if (!vehicle) {
      req.flash("error", "Vehicle not found")
      return res.redirect("/inv/")
    }

    // Pré-remplir les champs du formulaire
    const formData = {
      card_name: "",
      card_number: "",
      expiry_date: "",
      cvv: "",
      amount: vehicle.inv_price
    }

    res.render("payment/payment", {
      title: "Vehicle Payment",
      nav,
      inv_id,
      vehicle,     // toujours inclus
      errors: null,
      ...formData
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Process Payment
 * ************************** */
paymentCont.processPayment = async function (req, res, next) {
  try {
    const { inv_id, card_name, card_number, expiry_date, cvv, amount } = req.body

    let nav = await utilities.getNav()
    const vehicle = await invModel.getInventoryById(inv_id)
    if (!vehicle) {
      req.flash("error", "Vehicle not found")
      return res.redirect("/inv/")
    }

    // Validation simple pour démonstration
    const errors = []
    if (!card_name || !card_number || !expiry_date || !cvv) {
      errors.push({ msg: "All card fields must be filled." })
    }
    if (Number(amount) !== Number(vehicle.inv_price)) {
      errors.push({ msg: "Amount does not match vehicle price." })
    }

    // Simuler erreurs possibles
    if (card_number.startsWith("0")) errors.push({ msg: "Card is expired." })
    if (card_number.startsWith("9")) errors.push({ msg: "Insufficient funds." })

    if (errors.length > 0) {
      return res.render("payment/payment", {
        title: "Vehicle Payment",
        nav,
        inv_id,
        vehicle,     //inclus ici aussi !
        errors,
        card_name,
        card_number,
        expiry_date,
        cvv,
        amount
      })
    }

    // Ajouter le paiement en base de données
    const result = await paymentModel.addPayment(
      inv_id,
      null, // account_id si tu gères les comptes, sinon null
      card_name,
      card_number,
      expiry_date,
      cvv,
      amount
    )

    if (result) {
      return res.render("payment/thankyou", {
        title: "Payment Successful",
        nav,
        vehicle
      })
    } else {
      errors.push({ msg: "Payment failed. Please try again." })
      return res.render("payment/payment", {
        title: "Vehicle Payment",
        nav,
        inv_id,
        vehicle,
        errors,
        card_name,
        card_number,
        expiry_date,
        cvv,
        amount
      })
    }
  } catch (error) {
    console.error("processPayment error:", error)
    next(error)
  }
}

module.exports = paymentCont
