const AppError = require("../utils/appError");

class PaymentCodesModel {
	static async add({ transactionConnection, applicationId, paymentCode }) {
		const sql = `INSERT INTO payment_codes(application_id, code) VALUES (?,?)`;
		const values = [applicationId, paymentCode];
		await transactionConnection.query(sql, values);
	}
}

module.exports = PaymentCodesModel;
