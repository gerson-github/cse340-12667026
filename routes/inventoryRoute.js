/* ***************************
 *  Server.js  ->  inventoryRoute  [Controller -> model]
 *  
 *  Este modulo, pega o que e gerado no controller e devolver para o browser
 *  
 * ************************** */


// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const inventoryValidate  = require('../utilities/inventory-validation')
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to build vehicle detail view
router.get("/detail/:inv_id", invController.getVehicleDetail);

// route to management view
router.get("/", invController.getManagement)

// Show Form Classification view
router.get("/add-classification", invController.showAddClassificationForm)

// handle Post
router.post(
  "/add-classification", 
   inventoryValidate.classificationRules(),
   inventoryValidate.checkClassificationData,
  invController.addClassification
)

// Vehicle-inventory view
router.get("/add-inventory", invController.showAddInventoryForm)
// handle Post
router.post(
  "/add-inventory", 
   inventoryValidate.vehiclesRules(),
   inventoryValidate.checkVehicleData,
  invController.addInventory
)

/*
 get inventory for AJAX route
*/
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

/* ***************************
 * Route to deliver edit inventory view
  ***************************/
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);
/* handle is not shown*/
//router.post("/update/", invController.updateInventory) //invValidate.newInventoryRules(),
router.post(
  "/edit-inventory",
  inventoryValidate.vehiclesRules(),
  inventoryValidate.checkUpdateData,
  invController.updateInventory
)

/* 
 Route to deliver Delete Item view
*/
router.get (
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteView)
)
/* 
 Process te delete inventory request
*/
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router;
