const ApplicationsServices = require("../services/ApplicationsServices");
const catchAsync = require("../utils/catchAsync");

exports.home = catchAsync(async (req, res, next) => {
	res.status(200).render("home", { title: "Home" });
});
exports.applications = catchAsync(async (req, res, next) => {
	const applications = await ApplicationsServices.getAll();
	res.status(200).render("applications", {
		title: "Applications",
		applications,
	});
});
exports.apply = catchAsync(async (req, res, next) => {
	res.status(200).render("apply", { title: "Apply" });
});
exports.payment = catchAsync(async (req, res, next) => {
	res.status(200).render("payment", {
		title: "Payment",
		paymentCode: req.query.paymentCode,
	});
});
exports.paied = catchAsync(async (req, res, next) => {
	const { success, order, amount_cents } = req.query;
	res.status(200).render("paied", {
		title: "Paied",
		success,
		order,
		amount_cents,
	});
});
