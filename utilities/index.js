const invModel = require("../models/inventory-model")
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
 * ************************************ */
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


Util.buildVehicleDetail = function(vehicle) {
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
    </section>
  `
}


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach(row => {
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
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
