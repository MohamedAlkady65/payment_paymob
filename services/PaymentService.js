const ApplicationsModel = require("../models/ApplicationsModel.js");
const PaymentModel = require("../models/PaymentModel.js");
const OrdersModel = require("../models/OrdersModel.js");
const calcHmac = require("../utils/calcHmac.js");
const TransactionsModel = require("../models/TransactionsModel.js");
const AppError = require("../utils/appError.js");

class PaymentServices {
	static async payWithCode({ paymentCode, method, phone }) {
		const applications = await ApplicationsModel.getByCode(paymentCode);

		console.log(applications);

		if (applications.length == 0) {
			throw new AppError("No application found with this code", 404);
		}

		const application = applications[0];
		if (application.transaction_id) {
			throw new AppError(
				"Application that is for this code is already paid",
				400
			);
		}

		const payment = new PaymentModel({
			paymentData: application,
			method,
			phone,
		});
		const data = await payment.createPayment();
		await OrdersModel.add(application.id, payment.orderId);
		return data;
	}

	static async onFinishCallback(data, hmac) {
		const [success, transactionId, orderId] = calcHmac.formJson(
			data.obj,
			hmac
		);
		if (success) {
			const method = data.obj.source_data.type;
			await TransactionsModel.add(transactionId, orderId, method);
		}
	}
}

module.exports = PaymentServices;
