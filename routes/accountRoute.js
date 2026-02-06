/****************************
 * Account Routes
 ****************************/
const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")


/* =========================
 * REGISTER
 * ========================= */
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* =========================
 * LOGIN
 * ========================= */
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
})


/* =========================
 * ACCOUNT MANAGEMENT
 * ========================= */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)
/* ===============================
 *  ACCOUNT MANAGEMENT ROUTES
 * =============================== */

// Afficher la page update
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Mettre à jour les infos du compte
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccount,
  utilities.handleErrors(accountController.updateAccount)
)

// Changer le mot de passe
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPassword,
  utilities.handleErrors(accountController.updatePassword)
)




module.exports = router
