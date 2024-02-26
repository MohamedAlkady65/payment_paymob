const catchAsync = require("../utils/catchAsync");
const applicationValidation = require("../validation/applicationValidation");
const ApplicationsServices = require("../services/ApplicationsServices");

exports.add = catchAsync(async (req, res, next) => {
	const application = await applicationValidation.validate(req.body);
	const paymentCode = await ApplicationsServices.add(application);
	res.status(200).json({
		status: "success",
		message: "Success Application",
		paymentCode,
	});
});

exports.getAll = catchAsync(async (req, res, next) => {
	const applications = await ApplicationsServices.getAll();
	res.status(200).json({
		status: "success",
		data:applications
	});
});

