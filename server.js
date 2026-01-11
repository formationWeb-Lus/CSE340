const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()

const app = express()
const staticRoutes = require("./routes/static")

/* View Engine */
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")

/* Static files */
app.use(staticRoutes)

/* Routes */
app.get("/", (req, res) => {
  res.render("index", { title: "Home" })
})

/* Server */
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
