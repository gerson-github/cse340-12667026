const utilities = require(".")
const {body, validationResult} = require("express-validator")
const validate = {}

/*
 Classification form - data validation rules
*/
validate.classificationRules = () => {
    return [
        //classification is required
        body("classification_name")
        .trim()
        .isString()
        .isLength({min: 1})
        .withMessage("Please provide a Classification Name."),
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []

    errors = validationResult(req)
    //errors = validationResult(req).array()

    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors: errors.array(),
        title: "Add New Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  
  module.exports = validate