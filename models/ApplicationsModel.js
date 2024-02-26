const AppError = require("../utils/appError");
const db = require("../db.js");
class ApplicationsModel {
	static async add(transactionConnection, application) {
		const sql = `INSERT INTO applications( email, first_name, last_name, phone, amount_cents) VALUES (?,?,?,?,?)`;
		const values = [
			application.email,
			application.firstName,
			application.lastName,
			application.phone,
			application.amountCents,
		];
		const [result] = await transactionConnection.query(sql, values);
		return result.insertId;
	}
	static async getAll() {
		const sql = `SELECT id, email, first_name , last_name , phone, 
		CAST((amount_cents/100) as FLOAT) as amount ,  IFNULL(p.code,"") as payment_code, t.order_id as payment_id  , t.payment_method 
		FROM applications a LEFT OUTER JOIN payment_codes p on a.id = p.application_id LEFT OUTER JOIN transactions t on a.id = t.application_id`;
		const [applications] = await db.query(sql);
		return applications;
	}
	static async getByCode(paymentCode) {
		const sql = `SELECT id, email, first_name, last_name, phone,amount_cents ,t.transaction_id
		FROM applications a LEFT OUTER JOIN payment_codes p on a.id = p.application_id 
		LEFT OUTER JOIN transactions t on p.application_id = t.application_id WHERE p.code = ?`;
		const values = [paymentCode];
		const [applications] = await db.query(sql, values);
		return applications;
	}
}

module.exports = ApplicationsModel;
