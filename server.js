/* ============================
 * Server.js - CSE340 Project
 * ============================ */

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const pool = require("./database/")
const cookieParser = require("cookie-parser")
require("dotenv").config()

// Routes & Controllers
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/invRoute")
const accountRoute = require("./routes/accountRoute")
const staticRoutes = require("./routes/static")
const utilities = require("./utilities/")
const paymentRoute = require("./routes/paymentRoute")

const app = express()

// ============================
// View Engine
// ============================
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

// ============================
// Sessions (UNE SEULE FOIS)
// ============================
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
}))

// ============================
// Flash messages (CORRECT)
// ============================
app.use(flash())

app.use((req, res, next) => {
  res.locals.messages = {
    notice: req.flash("notice"),
    success: req.flash("success"),
    error: req.flash("error"),
  }
  next()
})

// ============================
// Body parsing
// ============================
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Cookies (JWT)
app.use(cookieParser())

// JWT middleware global
app.use(utilities.checkJWTToken)

// Static files
app.use(express.static("public"))
app.use(staticRoutes)

// ============================
// Routes
// ============================
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/payment", paymentRoute)

// 404
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// Global error handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

// ============================
// Server
// ============================
const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`✅ App running on port ${port}`)
})
