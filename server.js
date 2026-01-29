/* ============================
 * Server.js - CSE340 Project
 * ============================ */

// Packages
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require("./database/")
require("dotenv").config()

// Routes & Controllers
const accountRoute = require("./routes/accountRoute")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/invRoute") // <-- corrigé ici
const staticRoutes = require("./routes/static")
const utilities = require("./utilities/") // important pour getNav, handleErrors

// App init
const app = express()

/* ============================
 * View Engine
 * ============================ */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* ============================
 * Middleware
 * ============================ */
// Sessions avec PostgreSQL
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body parsing
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Static files
app.use(express.static("public"))
app.use(staticRoutes)

/* ============================
 * Routes
 * ============================ */
// Home page
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes
app.use("/account", accountRoute)

// Route volontaire pour 500
app.get("/trigger-error", (req, res, next) => {
  next(new Error("Forced 500 error for testing"))
})

// 404 - must be last route
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// Middleware d'erreur
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if(err.status === 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  })
})

/* ============================
 * Server
 * ============================ */
const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
