const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./utilities/inventoryRoute")
const staticRoutes = require("./routes/static")
const utilities = require("./utilities/") // ✅ Important

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
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(staticRoutes)

/* ============================
 * Routes
 * ============================ */
// Home page
// Home page
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

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
