const Joi = require("joi");

exports.validate = async (data) => {
	const schema = Joi.object({
		amount: Joi.number().min(1).required(),
		email: Joi.string().email().required(),
		firstName: Joi.string().min(1).max(60).required(),
		lastName: Joi.string().min(1).max(60).required(),
		phone: Joi.string().min(5).max(20).required(),
	});

	const paymentData = await schema.validateAsync(data);
	paymentData.amountCents = Math.floor(paymentData.amount * 100);
	delete paymentData.amount;
	return paymentData;
};
