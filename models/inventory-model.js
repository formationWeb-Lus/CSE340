const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
  } catch (error) {
    console.error("getClassifications error:", error)
    throw error
  }
}

/* ***************************
 *  Get inventory by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT *
       FROM public.inventory AS i
       JOIN public.classification AS c
         ON i.classification_id = c.classification_id
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
    throw error
  }
}

// Get a single vehicle by ID
async function getVehicleById(inv_id) {
  const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`
  const values = [inv_id]
  return await pool.query(sql, values) // pool = connection PostgreSQL
}




module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
}
