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
const checkAccountType = require('../utilities/checkAccountType')

// Route to build inventory by classification view
router.get("/type/:classificationId",  invController.buildByClassificationId);
router.get("/detail/:inv_id",  invController.getVehicleDetail); // route to build vehicle detail view

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))  /*  get inventory for AJAX route*/

//ADMIN Only routes (proteted)

// route to management view - Exite a tela de Gerenciamento de veiculo
router.get("/", checkAccountType(["Admin","Employee"]), invController.getManagement)

// Show Form Classification view
router.get("/add-classification", checkAccountType(["Admin","Employee"]), invController.showAddClassificationForm)
router.post("/add-classification", checkAccountType(["Admin"]), inventoryValidate.classificationRules(), inventoryValidate.checkClassificationData, invController.addClassification)

// Vehicle-inventory view
router.get("/add-inventory", checkAccountType(["Admin","Employee"]), invController.showAddInventoryForm)
router.post("/add-inventory", checkAccountType(["Admin","Employee"]), inventoryValidate.vehiclesRules(), inventoryValidate.checkVehicleData, invController.addInventory)

/* ***************************
 * Route to deliver edit inventory view
  ***************************/
router.get("/edit/:inv_id", checkAccountType(["Admin"]), utilities.handleErrors(invController.editInventoryView));
router.post("/edit-inventory", checkAccountType(["Admin"]), inventoryValidate.vehiclesRules(), inventoryValidate.checkUpdateData, invController.updateInventory)

/* 
 Route to deliver Delete Item view
*/
router.get ("/delete/:inv_id", checkAccountType(["Admin"]), utilities.handleErrors(invController.deleteView))
router.post("/delete", checkAccountType(["Admin"]), utilities.handleErrors(invController.deleteInventory))



module.exports = router;
