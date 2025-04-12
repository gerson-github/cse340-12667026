const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}

/*
 Registration form - data validation rules
*/
validate.registrationRule = () => {
    return [
        //name is required
        body("account_firstname")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a first name."),

        //lastname is required
        body("account_lastname")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a last name."),

        //email
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),

        //password is required
        body("account_password")
         .trim()
         .isStrongPassword(
            {
                minLength: 12,
                minLowercase: 1,
                minUppercase:1,
                minNumbers: 1,
                minSymbols: 1,
            }
         )
        .withMessage("Password doe not meet requirements."),

    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }
  
  module.exports = validate