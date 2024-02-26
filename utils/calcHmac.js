const AppError = require("./appError");
const crypto = require("crypto");

exports.formJson = (data, hmac) => {
	const concatQuery = [
		data.amount_cents,
		data.created_at,
		data.currency,
		data.error_occured,
		data.has_parent_transaction,
		data.id,
		data.integration_id,
		data.is_3d_secure,
		data.is_auth,
		data.is_capture,
		data.is_refunded,
		data.is_standalone_payment,
		data.is_voided,
		data.order.id,
		data.owner,
		data.pending,
		data.source_data.pan,
		data.source_data.sub_type,
		data.source_data.type,
		data.success,
	].join("");

	const hmacHashed = createHmac(concatQuery);

	if (hmac === hmacHashed) {
		return [data.success, data.id, data.order.id];
	}
	throw new AppError("Error, Invalid data provided", 400);
};

const createHmac = (data) =>
	crypto
		.createHmac("sha512", process.env.PAYMENT_HMAC_KEY)
		.update(data)
		.digest("hex");
