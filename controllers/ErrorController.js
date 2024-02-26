const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message || "",
		errors: err.errors,
		error: err,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message || "",
			errors: err.errors,
		});
	} else {
		res.status(500).json({
			status: "error",
			message: "Server Error, Something went wrong",
		});
	}
};

module.exports = (err, req, res, next) => {
	let error = err;

	error.statusCode = error.statusCode || 500;
	error.status = error.status || "error";

	// if (process.env.ENV == "development") {
	// 	sendErrorDev(error, res);
	// } else if (process.env.ENV == "production") {
	// 	sendErrorProd(error, res);
	// }

	console.log(error);

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message || "",
		errors: err.errors,
		error: err,
		stack: err.stack,
	});
};
