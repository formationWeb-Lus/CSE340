/****************************
 * Account Controller
 ****************************/

// Utilities
const utilities = require("../utilities")
const accountModel = require("../models/account-model")

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  try {
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    if (regResult) {
      // Message flash de succès
      req.flash(
        "success",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      )
      return res.redirect("/account/login")
    } else {
      // Message flash d'échec
      req.flash("error", "Sorry, the registration failed.")
      // On renvoie aussi les champs pour pré-remplir le formulaire
      return res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email
      })
    }
  } catch (error) {
    console.error("registerAccount error:", error)
    req.flash("error", "Sorry, there was a server error. Please try again.")
    // On renvoie aussi les champs pour pré-remplir le formulaire
    return res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: null,
    account_lastname: null,
    account_email: null
  })
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount
}
