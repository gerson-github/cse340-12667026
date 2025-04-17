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
  

/*
  Account update validation rules
*/
validate.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .notEmpty()
      .withMessage("First name is required."),

    body("account_lastname")
      .notEmpty()
      .withMessage("Last name is required."),

    body("account_email")
      .isEmail()
      .withMessage("Valid email required.")
      .normalizeEmail(),
  ]
}

/*
  Password update validation rules
*/
validate.passwordRules = () => {
  return [
    body("account_password")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/)
      .withMessage("Password must be at least 12 characters and contain an uppercase letter, a number, and a special character.")
  ]
}

/* ********************************************
 * Check account update data
 ******************************************** */
validate.checkAccountUpdateData = async (req, res, next) => {
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      account_id: req.body.account_id,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
    })
    return
  }

  next()
}

/*
 * Middleware para verificar dados da atualização de senha
 */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id, account_password } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-password", {
      errors,
      title: "Update Password",
      nav,
      account_id,
      account_password,
    })
    return
  }

  next()
}


  module.exports = validate