/* ***************************
 *  MVC STYLE
 *  THIS FILE IF ->  M O D E L
 * 
 * ps: Represents the data, business logic, and rules of the application.
 * 
 * ************************** */

const pool = require("../database")

/* 
 register a new account
*/
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {

  try {
    
    const sql = "insert into account ( account_firstname, account_lastname, account_email, account_password, account_type) values ($1,$2,$3,$4,'Client') Returning *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])

  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = {registerAccount, getAccountByEmail };