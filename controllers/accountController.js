/* ***************************
 *  MVC STYLE
 *  THIS FILE IF ->  C O N T R O L L E R
 *
 *  ps: Acts as an intermediary between the Model and the View.
 *
 * ************************** */

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const accountController = {}
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

require("dotenv").config()


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
/* 
  deliver registration view
*/
async function buildRegister(req,res,next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
  
}

/*
  deliver after deliver account-management, saying your logged in
*/
async function buildAccountManagement(req,res,next) {
  let nav = await utilities.getNav()

  res.redirect("/")

  // res.render("account/account-management", {
  //   title: "Login",
  //   nav,
  //   errors: null,
  // })
  
}



/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* 
 login process activity
*/
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again. Account name not Found !")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {

    //if (await bcrypt.compare(account_password, accountData.account_password)) {
    if (account_password === accountData.account_password) {
      
      console.log("*** Deu POSITIVO **")

      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      req.session.loggedin = true
      req.session.accountId = accountData.account_id
      req.session.firstname = accountData.account_firstname
      req.session.lastname = accountData.account_lastname
      req.session.email = accountData.account_email

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }

      return res.redirect("/account/")

    }
    else {
      req.flash("message notice", "Please check your credentials and try again. Account password not match !")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
   throw new Error('Access Forbidden')

  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout Error:", err)
    }
    res.clearCookie("jwt") // Optional: clear the cookie
    res.redirect("/") // Or wherever your homepage is
  })
}

module.exports =  {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, logout}