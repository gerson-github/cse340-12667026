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


validate.vehiclesRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Make must be at least 3 characters long."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Model must be at least 3 characters long."),

    body("inv_description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long."),

    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    body("inv_year")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be between 1900 and 2100."),

    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative integer."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),

    body("classification_id")
      .notEmpty()
      .withMessage("Classification must be selected.")
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
  
/*
  check data and return error for Vehicle form
*/

  validate.checkVehicleData = async (req, res, next) => {
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
  
    let errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)
  
      res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: errors.array(),
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
      return
    }
    next()
  }
  




  module.exports = validate