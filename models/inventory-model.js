/* ***************************
 *  MVC STYLE
 *  THIS FILE IF ->  M O D E L
 * 
 * ps: Represents the data, business logic, and rules of the application.
 * 
 * ************************** */

const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle detail
 * ************************** */
async function getVehicleById(inv_id) {
  try {
      const sql = "SELECT *, TO_CHAR(inv_price, 'FM999,999,999') as inv_price_dec, TO_CHAR(inv_miles, 'FM999,999,999') as inv_miles_dec FROM inventory WHERE inv_id = $1";
      const result = await pool.query(sql, [inv_id]);
      return result.rows[0]; // Assuming PostgreSQL (for MySQL, use result[0])
  } catch (error) {
      console.error("Database Error:", error);
      throw error;
  }
}

/* 
 add new Classification 
*/
async function addClassification(classification_name) {

  try {
    
    const sql = "insert into classification ( classification_name) values ($1) Returning *"
    return await pool.query(sql, [classification_name])

  } catch (error) {
    return error.message
  }
}
/* 
 add new vehicle 
*/
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {

  try {
    
    const sql = "insert into inventory ( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) Returning *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])

  } catch (error) {
    return error.message
  }
}
/*
 get classification name by Id
*/
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory AS i 
       JOIN classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("Delete Inventory Error: " + error)
  }
}




module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventoryItem};