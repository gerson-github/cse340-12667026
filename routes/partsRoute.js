const express = require("express")
const router = new express.Router()
const partsController = require("../controllers/partsController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')


// Rota GET para exibir a página de peças
router.get("/", partsController.buildPartsView)

module.exports = router
