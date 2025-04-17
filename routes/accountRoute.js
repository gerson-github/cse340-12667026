
/* *******
* Account Routes
* Unit 4, deliver login view activity
*/

// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


/* *******
* Deliver Login View
* Unit 4, deliver login view
*/
router.get("/login", utilities.handleErrors(accountController.buildLogin ))

/* 
 Login process activity
*/
router.post(
    "/login",
    //regValidate.loginRules(),
    //regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )



router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post(
    "/register",
    regValidate.registrationRule(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


// Default account management route
router.get("/", utilities.handleErrors(accountController.buildAccountManagement))

// Essa e Route do logout
router.get("/logout", accountController.logout)


module.exports = router;