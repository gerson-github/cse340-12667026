/* ***************************
 *  MVC STYLE
 *  THIS FILE IF ->  C O N T R O L L E R
 *
 *  ps: Acts as an intermediary between the Model and the View.
 *
 * ************************** */

const utilities = require("../utilities")
const accountController = {}

/*
  deliver login view
*/
async function buildLogin(req,res,next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    
  })
  
}

module.exports =  {buildLogin}