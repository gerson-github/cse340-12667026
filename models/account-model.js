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

// Atualiza os dados de nome, sobrenome e email de uma conta
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ])

    return result.rows[0] // Retorna os dados atualizados
  } catch (error) {
    console.error("Error updating account: ", error)
    return new Error("Account update failed")
  }
}

async function updatePassword(account_password, account_id) {
  try {
    const sql = `UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *;`
    const result = await pool.query(sql, [account_password, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error updating password:", error)
    throw new Error("Password update failed")
  }
}


async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type 
       FROM account 
       WHERE account_id = $1`,
      [account_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error getting account by ID:", error)
    throw new Error("Could not get account by ID")
  }
}

module.exports = {registerAccount, getAccountByEmail, updateAccount, updatePassword, getAccountById };