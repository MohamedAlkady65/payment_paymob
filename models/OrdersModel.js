const db = require("../db");
const AppError = require("../utils/appError");

class OrdersModel {
	static async add(applicationId, orderId) {
		const sql = `INSERT INTO orders(order_id , application_id) 
        VALUES (?,?)
        ON DUPLICATE KEY
        UPDATE application_id=?`;
		const values = [orderId, applicationId, applicationId];
		await db.query(sql, values);
	}
}

module.exports = OrdersModel;
