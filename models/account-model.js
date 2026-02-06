const pool = require("../database/index")


/* *****************************
*   Register new account
* *************************** */
const bcrypt = require("bcryptjs")

async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword,
    ])

    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function getAccountByEmail(account_email) {
  const result = await pool.query(
    `SELECT account_id, account_firstname, account_lastname,
            account_email, account_type, account_password
     FROM account WHERE account_email = $1`,
    [account_email]
  )
  return result.rows[0]
}
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT 
        account_id,
        account_firstname,
        account_lastname,
        account_email
      FROM account
      WHERE account_id = $1
    `
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}


async function updateAccount(account_id, firstname, lastname, email) {
  return pool.query(
    `UPDATE account SET
     account_firstname=$1,
     account_lastname=$2,
     account_email=$3
     WHERE account_id=$4`,
    [firstname, lastname, email, account_id]
  )
}

async function updatePassword(account_id, password) {
  return pool.query(
    "UPDATE account SET account_password=$1 WHERE account_id=$2",
    [password, account_id]
  )
}




module.exports = {
  registerAccount,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword

}
