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
      const sql = "SELECT *, TO_CHAR(inv_price, 'FM999,999,999') as inv_price_dec FROM inventory WHERE inv_id = $1";
      const result = await pool.query(sql, [inv_id]);
      return result.rows[0]; // Assuming PostgreSQL (for MySQL, use result[0])
  } catch (error) {
      console.error("Database Error:", error);
      throw error;
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById};