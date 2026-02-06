/****************************
 * Account Controller
 ****************************/

// Utilities
const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ****************************************
 *  Build account management view
 * ************************************ */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()

  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
  })
}


/* ****************************************
 *  Process Login
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  try {
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("error", "Invalid email or password.")
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    const passwordMatch = await bcrypt.compare(
      account_password,
      accountData.account_password
    )

    if (!passwordMatch) {
      req.flash("error", "Invalid email or password.")
      return res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // 🔐 CREATE JWT
    const accessToken = jwt.sign(
      {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_type: accountData.account_type,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    )

    // 🍪 STORE JWT IN COOKIE
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    })

    // ✅ REDIRECTION ICI
    return res.redirect("/account/")

  } catch (error) {
    console.error("accountLogin error:", error)
    req.flash("error", "Login failed. Please try again.")
    return res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
 *  Build update account view
 * *************************************** */
async function buildUpdateAccount(req, res) {
  const account_id = req.params.account_id
  const account = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav: await utilities.getNav(),
    errors: null,
    message: null,
    account,
  })
}


/* ***************************
 *  Update Password
 * ************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const nav = await utilities.getNav()

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (result) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    } else {
      throw new Error("Password update failed")
    }
  } catch (error) {
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Password update failed." }],
      account: req.body,
    })
  }
}


/* ***************************
 *  Update Account Info
 * ************************** */
async function updateAccount(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const nav = await utilities.getNav()

  try {
    const result = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (result) {
      req.flash("notice", "Account information updated successfully.")
      return res.redirect("/account/")
    } else {
      throw new Error("Update failed")
    }
  } catch (error) {
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Account update failed." }],
      account: req.body,
    })
  }
}

/* ***************************
 *  Update Password
 * ************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const nav = await utilities.getNav()

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (result) {
      req.flash("notice", "Password updated successfully.")
      return res.redirect("/account/")
    } else {
      throw new Error("Password update failed")
    }
  } catch (error) {
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: "Password update failed." }],
      account: req.body,
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountManagement,
  accountLogin,
  buildUpdateAccount,
  updateAccount,
  updatePassword,
}


