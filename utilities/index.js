/* ***************************
 *  FOLDER UTILLITIES - index.js
 *
 *  Gera o HTML Dinamico que sera inserido na paginda EJS.
 *   
 * ************************** */

const invModel = require("../models/inventory-model")
const Util = {}

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {


  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  //let grid
  let grid = ""
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 * Build Vehicle Detail view
 ************************** */
Util.buildVehicleDetailHTML = async function (req, res, next) {
  // let vehicle = await invModel.getVehicleById(req.inv_id)
  const vehicle = req;
  let vehicleDetailHtml = ""
 
  vehicleDetailHtml = `
       <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>     
        <div class="vehicle-detail">
            <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
            <div id="vehicle-summary">
              <h2>Price: $${vehicle.inv_price_dec}</h2>
              <p><strong>Year:</strong> ${vehicle.inv_year}</p>
              <p><strong>Description:</strong> ${vehicle.inv_description}</p>              
              <p><strong>Color:</strong> ${vehicle.inv_color}</p>              
              <p><strong>Miles:</strong> ${vehicle.inv_miles_dec}</p>              
            </div>
        </div>
    `
  return vehicleDetailHtml
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

//  Util.decodeJWT = async function (token = null) {
//   try {
//     return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//   } catch (err) {
//     console.error("Invalid token:", err)
//     return null
//   }
// }

/* ****************************************
 * Middleware para proteger rotas privadas
 **************************************** */
Util.checkLogin = function (req, res, next) {
  const token = req.cookies.jwt
  if (!token) {
    req.flash("notice", "Please log in to access this page.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.accountData = decoded // opcional: guardar os dados do usuário para uso futuro
    next()
  } catch (err) {
    console.log("JWT verification failed:", err.message)
    req.flash("notice", "Session expired or invalid. Please log in again.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util

