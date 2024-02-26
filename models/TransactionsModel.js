const AppError = require("../utils/appError");
const db = require("../db");

class TransactionsModel {
	static async add(transactionId, orderId, method) {
		const sql = `INSERT INTO transactions(application_id,order_id,transaction_id,payment_method) 
		VALUES ((SELECT application_id FROM orders WHERE order_id = ?),?,?,?)`;
		const values = [orderId, orderId, transactionId, method];
		await db.query(sql, values);
	}
}

module.exports = TransactionsModel;
