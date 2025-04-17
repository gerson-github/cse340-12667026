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
//const bcrypt = require("bcrypt")

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

  const token = req.cookies.jwt
  //const decoded = utilities.decodeJWT(token) 
   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname: decoded.account_firstname,
    account_id: decoded.account_id,
    account_type: decoded.account_type,
  })

  //  res.render("account/account-management", {
  //    title: "Login",
  //    nav,
  //    errors: null,
  //  })
  
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
      const accessToken = jwt.sign(
        accountData
        , process.env.ACCESS_TOKEN_SECRET
        , 
        { expiresIn: 3600 * 1000 })

      req.session.loggedin = true
      req.session.accountId = accountData.account_id
      req.session.firstname = accountData.account_firstname
      req.session.lastname = accountData.account_lastname
      req.session.email = accountData.account_email
      req.session.account_type = accountData.account_type 
 

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

async function showUpdateForm(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const account = await accountModel.getAccountById(account_id)

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    account,
    errors: null,
    messages: req.flash("notice"),
  })
}

async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Failed to update account info.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      account: await accountModel.getAccountById(account_id),
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
      messages: req.flash("notice"),
    })
  }
}

//const bcrypt = require("bcrypt")

async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  try {
    //const hashedPassword = await bcrypt.hash(account_password, 10)
    const hashedPassword = account_password
    const updateResult = await accountModel.updatePassword(hashedPassword,account_id)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/")
    } else {
      throw new Error("Update failed")
    }
  } catch (error) {
    req.flash("notice", "Error updating password.")
    res.status(500).render("account/update-account", {
      title: "Update Account",
      nav,
      account: await accountModel.getAccountById(account_id),
      errors: null,
      messages: req.flash("notice"),
    })
  }
}



module.exports =  {buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, logout, showUpdateForm, updateAccountInfo, changePassword}