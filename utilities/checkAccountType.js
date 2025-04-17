const jwt = require("jsonwebtoken")

require("dotenv").config()

function checkAccountType(allowedRoles = [] )  {
    return function (req, res, next) {

        const token = req.cookies.jwt


        if (!token) {
            req.flash("notice", "You must be logged in to access that page.")
            return res.redirect("/account/login")
        }

        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            //const allowedRoles = ["Client", "Admin"]
            if (allowedRoles.includes(decoded.account_type)) {
            req.accountData = decoded // you can use this later if needed
            return next()
            } else {
            req.flash("notice", "You do not have permission to view that page.")
            return res.redirect("/account/login")
            }
        } catch (err) {
            console.log("JWT Auth Error:", err)
            req.flash("notice", "Session expired or invalid. Please log in again.")
            return res.redirect("/account/login")
        }
    }
}

module.exports = checkAccountType
