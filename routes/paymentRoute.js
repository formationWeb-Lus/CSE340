const express = require("express")
const router = express.Router()
const paymentController = require("../controllers/paymentController")
const paymentValidate = require("../utilities/payment-validation")
const utilities = require("../utilities")

// Show payment page
router.get(
  "/:inv_id",
  utilities.handleErrors(paymentController.buildPaymentView)
)

// Process payment
router.post(
  "/",
  paymentValidate.paymentRules(),
  paymentValidate.checkPaymentData,
  utilities.handleErrors(paymentController.processPayment)
)

// Thank You page
router.get(
  "/thankyou",
  utilities.handleErrors(paymentController.buildThankYou)
)

module.exports = router
