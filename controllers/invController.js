/* ***************************
 *  MVC STYLE
 *  THIS FILE IF ->  C O N T R O L L E R
 * 
 *  ps: Acts as an intermediary between the Model and the View.
 * 
 * ************************** */

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id; // Extract the inventory ID from the URL
    const vehicle = await invModel.getVehicleById(inv_id); // Fetch vehicle data from DB

    if (!vehicle) {
      return res.status(404).send("Vehicle not found");
    }

    const vehicleHTML = await utilities.buildVehicleDetailHTML(vehicle);
    let nav = await utilities.getNav();

    res.render("./inventory/detail", {
      title: `${vehicle.make} ${vehicle.model}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  Management view
*/
invCont.getManagement = async function (req, res, next) {
  try {
      
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
};

/* 
  Show Classification view
*/
invCont.showAddClassificationForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    message: req.flash("message"),
    errors: null,
  })
}

/* 
 add classification to the database
*/
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const nav = await utilities.getNav()

  try {
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("notice", "New classification added successfully!")
      res.redirect("/inv")
    } else {
      req.flash("message", "Failed to add classification.")
      res.redirect("/inv/add-classification")
    }
  } catch (error) {
    next(error)
  }
}

/* 
  Show Vehicle-Inventory view
*/
invCont.showAddInventoryForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    message: req.flash("message"),
    errors: null,
  })
}

/* 
 add vehicle-inventory to the database
*/
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  try {
    const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (result) {
      req.flash("notice", "New inventory added successfully!")
      res.redirect("/inv")
    } else {

      const classificationList = await utilities.buildClassificationList(classification_id)
      req.flash("notice", "Failed to add inventory.")
      // res.redirect("/inv/add-inventory")
      res.render("inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        message: req.flash("message"),
     
      })
    }
  } catch (error) {
    next(error)
  }
}
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}




module.exports = invCont