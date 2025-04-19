const utilities = require("../utilities/")

const partsController = {}

partsController.buildPartsView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("parts/index", {
    title: "Parts Page",
    nav,
    errors: null
  })
}

module.exports = partsController
