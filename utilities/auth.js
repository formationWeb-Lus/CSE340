const jwt = require("jsonwebtoken")
require("dotenv").config()

function checkLogin(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("error", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = decoded
    res.locals.loggedin = true
    next()
  } catch (err) {
    req.flash("error", "Session expired. Please log in again.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkLogin }
