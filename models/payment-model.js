const pool = require("../database/");


  // Add Payment method 

async function addPayment(
  inv_id,
  card_name,
  card_number,
  expiry_date,
  cvv,
  amount
) {
  try {
    // 🔹 Sécurisation : si null ou undefined, mettre une valeur vide
    card_name = card_name ? card_name.slice(0, 50) : "";
    card_number = card_number ? card_number.slice(0, 16) : "";
    expiry_date = expiry_date ? expiry_date.slice(0, 7) : "";
    cvv = cvv ? cvv.slice(0, 4) : "";

    const sql = `
      INSERT INTO public.payment (
        inv_id,
        amount,
        expiry_date,
        cvv,
        card_name,
        card_number
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING payment_id, inv_id, amount, expiry_date, cvv, card_name, card_number, payment_date
    `;

    const data = await pool.query(sql, [
      inv_id,
      amount,
      expiry_date,
      cvv,
      card_name,
      card_number
    ]);

    return data.rows[0];

  } catch (error) {
    console.error("addPayment error:", error);
    throw error;
  }
}

module.exports = {
  addPayment
};

