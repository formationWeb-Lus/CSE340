const utilities = require("../utilities")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* **********************************
 * Registration Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name required."),
    body("account_email").trim().isEmail().withMessage("Valid email required."),
    body("account_password")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* **********************************
 * Check Registration Data
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      ...req.body,
    })
  }
  next()
}

/* **********************************
 * Login Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email").trim().isEmail().withMessage("Valid email required."),
    body("account_password").trim().notEmpty().withMessage("Password required."),
  ]
}

/* **********************************
 * Check Login Data
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* **************************************
 * Update Account Rules
 * ************************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name required."),
    body("account_lastname").trim().notEmpty().withMessage("Last name required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("Valid email required.")
      .custom(async (email, { req }) => {
        const account = await accountModel.getAccountByEmail(email)
        if (account && account.account_id != req.body.account_id) {
          throw new Error("Email already exists.")
        }
      }),
  ]
}

/* **************************************
 * Check Update Account
 * ************************************* */
validate.checkUpdateAccount = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account: req.body,
    })
  }
  next()
}

/* **************************************
 * Password Rules
 * ************************************* */
validate.passwordRules = () => {
  return [
    body("account_password")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* **************************************
 * Check Password
 * ************************************* */
validate.checkPassword = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account: req.body,
    })
  }
  next()
}

module.exports = validate
