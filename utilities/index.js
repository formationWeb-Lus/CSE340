const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")

const Util = {}

/* ************************
 * Build navigation menu
 ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}"
           title="See our inventory of ${row.classification_name} vehicles">
           ${row.classification_name}
        </a>
      </li>`
  })

  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification grid HTML
 ************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid = ""

  if (data.length > 0) {
    grid = '<ul id="inv-display">'

    data.forEach((vehicle) => {
      grid += `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}"
             title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
            <img src="${vehicle.inv_thumbnail}"
                 alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
          </a>
          <div class="namePrice">
            <hr>
            <h2>
              <a href="/inv/detail/${vehicle.inv_id}">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>
            </h2>
            <span>$${new Intl.NumberFormat("en-US")
              .format(vehicle.inv_price)}</span>
          </div>
        </li>`
    })

    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }

  return grid
}

/* **************************************
 * Build vehicle detail HTML
/* **************************************
 * Build vehicle detail HTML
 ************************************** */
Util.buildVehicleDetail = function (vehicle) {
  return `
    <section class="vehicle-detail">
      <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="details">
        <p><strong>Price:</strong> $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Year:</strong> ${vehicle.inv_year}</p>
        <p><strong>Mileage:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>
      </div>

      <!-- BOUTON PAY NOW -->
      <div class="payment-btn" style="margin-top: 20px;">
        <form action="/payment/${vehicle.inv_id}" method="get">
          <button type="submit" class="btn-pay">
            Pay Now
          </button>
        </form>
      </div>
    </section>
  `
}



/* **************************************
 * Build classification dropdown list
 ************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()
 let classificationList =
  '<select id="classificationList" name="classification_id" required>'

  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`
    if (classification_id == row.classification_id) {
      classificationList += " selected"
    }
    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * JWT Check Middleware
 **************************************** */
Util.checkJWTToken = function (req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    res.locals.loggedin = false
    return next()
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("jwt")
      res.locals.loggedin = false
      return next()
    }

    res.locals.loggedin = true
    res.locals.accountData = decoded
    next()
  })
}

/* ****************************************
 * Error Handling Wrapper
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 *  Check Login (Authorization)
 * ************************************ */
/* ****************************************
 *  Check Login (Authorization)
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("error", "Please log in before you go to this page.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Check Employee or Admin
 * ************************************ */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (
    res.locals.loggedin &&
    res.locals.accountData &&
    (
      res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin"
    )
  ) {
    return next()
  }

  req.flash("notice", "Please log in with proper credentials.")
  return res.redirect("/account/login")
}




module.exports = Util
