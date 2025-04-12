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

    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      
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
  Show Inventory view
*/
invCont.showAddInventoryForm = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    message: req.flash("message"),
    errors: null,
  })
}


/* 
 add inventory to the database
*/
invCont.addInventory = async function (req, res, next) {
  const { inventory_name } = req.body
  const nav = await utilities.getNav()

  try {
    const result = await invModel.addInventory(inventory_name)
    if (result) {
      req.flash("message", "New inventory added successfully!")
      res.redirect("/inv")
    } else {
      req.flash("message", "Failed to add inventory.")
      res.redirect("/inv/add-inventory")
    }
  } catch (error) {
    next(error)
  }
}






module.exports = invCont