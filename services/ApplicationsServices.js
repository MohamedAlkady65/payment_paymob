const AppError = require("../utils/appError");
const db = require("../db.js");
const ApplicationsModel = require("../models/ApplicationsModel.js");
const PaymentCodesModel = require("../models/PaymentCodesModel.js");

class ApplicationsServices {
	static async add(application) {
		const transactionConnection = await db.transactionConnection();
		const paymentCode = Math.floor(Math.random() * 1e10);
		await transactionConnection.run(async () => {
			const applicationId = await ApplicationsModel.add(
				transactionConnection,
				application
			);
			await PaymentCodesModel.add({
				transactionConnection,
				applicationId,
				paymentCode,
			});
		});
		return paymentCode;
	}
	static async getAll() {
		const applications = await ApplicationsModel.getAll();
		return applications;
	}
}

module.exports = ApplicationsServices;
