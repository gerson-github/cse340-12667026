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

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// route to build vehicle detail view
router.get("/detail/:inv_id", invController.getVehicleDetail);

module.exports = router;
