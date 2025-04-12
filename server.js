/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities") 
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const messages = require('express-messages')

/* ***********************
 * Middleware - criou um cook e tambem gravou no banco de dados
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// app.use(flash())

// app.use((req, res, next) => {
//   res.locals.messages = messages(req, res)
//   next()
// })

/* ***********************
// Express Messages Middleware - Esse aqui deve gerar uma mensage na tela
* ************************/
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Middleware - for parsing application/x-www-form-urlencoded
 * ************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) 

/* ***********************
 * Routes
 *************************/
app.use(static)
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


//index route
// app.get('/', (req, res) => {
//   console.log('user hit the resource')
//   res.render("index", {title:"home"})
//   //res.status(200).send('Home Page')
// })
//app.get("/", baseController.buildHome) 
app.get("/", utilities.handleErrors(baseController.buildHome)) // executa 1
app.use("/inv", inventoryRoute)  // executa 2
app.use("/account", accountRoute)  // executa 3

// Catch-all route for invalid URLs (404 Not Found)
app.use((req, res, next) => {
  const error = new Error('Sorry, we appear to have lost that page.');
  error.status = 404;
  next(error); // Pass to the error handler
});


// app.use(async (req, res, next) => {   //  executa 3
//    next({status: 404, message: 'Sorry, we appear to have lost that page.'})
// })

// app.all('*', (req, res) => {
//    res.status(404).send('Resource not fount !')
// })

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//   res.render("errors/error", {
//     title: err.status || 'Server Error',
//     message: err.message,
//     nav
//   })
// })
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


