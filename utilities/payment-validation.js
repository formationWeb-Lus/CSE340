const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const invModel = require("../models/inventory-model");

// Payment Validation Rules
 
const paymentRules = () => {
  return [
    body("card_name")
      .trim()
      .notEmpty()
      .withMessage("Card holder name is required.")
      .isLength({ max: 50 })
      .withMessage("Card holder name is too long."),

    body("card_number")
      .isLength({ min: 16, max: 16 })
      .withMessage("Card number must be 16 digits.")
      .isNumeric()
      .withMessage("Card number must contain only numbers."),

    body("expiry_date")
      .matches(/^(0[1-9]|1[0-2])\/\d{2,4}$/)
      .withMessage("Expiry date must be in MM/YY or MM/YYYY format."),

    body("cvv")
      .isLength({ min: 3, max: 4 })
      .withMessage("CVV must be 3 or 4 digits.")
      .isNumeric()
      .withMessage("CVV must contain only numbers."),

    body("amount")
      .isFloat({ min: 1 })
      .withMessage("Amount must be greater than 0."),
  ];
};

// Check Payment Data
 
const checkPaymentData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const { inv_id } = req.body;

    //  Récupérer le véhicule pour éviter l’erreur "vehicle is not defined"
    let vehicle = null;
    if (inv_id) {
      vehicle = await invModel.getInventoryById(inv_id);
    }

    const nav = await utilities.getNav();

    return res.render("payment/payment", {
      title: "Vehicle Payment",
      nav,
      inv_id,
      vehicle, // 🔥 IMPORTANT pour EJS
      errors: errors.array(),
      card_name: req.body.card_name || "",
      card_number: req.body.card_number || "",
      expiry_date: req.body.expiry_date || "",
      cvv: req.body.cvv || "",
      amount: req.body.amount || "",
    });
  }

  next();
};

module.exports = {
  paymentRules,
  checkPaymentData,
};
