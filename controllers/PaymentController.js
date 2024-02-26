const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const PaymentServices = require("../services/PaymentService");
exports.payWithCode = catchAsync(async (req, res, next) => {
	const paymentCode = +req.params.code;
	const method = req.query.method;
	const phone = req.body.phone;
	if (isNaN(paymentCode)) {
		throw new AppError("Please provide valid payment code", 400);
	}

	if (method && !phone) {
		throw new AppError(
			"phone is requierd when payment method is wallet",
			400
		);
	}
	const data = await PaymentServices.payWithCode({
		paymentCode,
		method,
		phone,
	});
	res.status(200).json({
		status: "success",
		data,
	});
});

exports.callback = catchAsync(async (req, res, next) => {
	await PaymentServices.onFinishCallback(req.body, req.query.hmac);
	res.status(200).json({
		status: "success",
	});
});
