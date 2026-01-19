const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const baseController = require("./controllers/baseController")
const inventoryRoute = require("./utilities/inventoryRoute")
const staticRoutes = require("./routes/static")

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

// Parse form data
app.use(express.urlencoded({ extended: true }))

// Parse JSON
app.use(express.json())

// Static files (CSS, images, JS)
app.use(express.static("public"))

// Static routes (errors, etc.)
app.use(staticRoutes)

/* ============================
 * Routes
 * ============================ */

// Home page
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

/* ============================
 * Server
 * ============================ */
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
