const axios = require("axios");
const AppError = require("../utils/appError");

class PaymentModel {
	constructor({ paymentData, method = "card", phone } = {}) {
		this.paymentData = paymentData;
		this.currency = "EGP";
		this.method = method == "wallet" ? "wallet" : "card";
		this.phone = phone;
		this.integrationId =
			method === "card"
				? process.env.PAYMENT_CARD_INTEGRATING_ID
				: process.env.PAYMENT_WALLET_INTEGRATING_ID;
	}

	async createPayment() {
		await this.getAuthToken();
		await this.makeOrder();
		await this.getPaymentToken();
		if (this.method === "card") {
			return this.iframeCardUrl();
		} else {
			return this.walletPayment();
		}
	}

	async walletPayment() {
		const res = await axios({
			method: "POST",
			url: "https://accept.paymob.com/api/acceptance/payments/pay",
			data: {
				source: {
					identifier: this.phone,
					subtype: "WALLET",
				},
				payment_token: this.paymentToken, // token obtained in step 3
			},
		});
		if (res.status === 200) {
			return res.data.redirect_url;
		}
		throw new AppError("Something went wrong", 500);
	}
	async getAuthToken() {
		const res = await axios({
			method: "POST",
			url: "https://accept.paymob.com/api/auth/tokens",
			data: {
				api_key: process.env.PAYMENT_API_KEY,
			},
		});
		if (res.status === 201) {
			this.authToken = res.data.token;
			return res.data;
		}
		throw new AppError("Something went wrong", 500);
	}
	async makeOrder() {
		console.log(this.paymentData);
		const res = await axios({
			method: "POST",
			url: "https://accept.paymob.com/api/ecommerce/orders",
			data: {
				auth_token: this.authToken,
				delivery_needed: "false",
				amount_cents: this.paymentData.amount_cents,
				currency: this.currency,
				items: [],
			},
		});
		if (res.status === 201) {
			this.orderId = res.data.id;
			return res.data;
		}
		throw new AppError("Something went wrong", 500);
	}
	async getPaymentToken() {
		const data = {
			auth_token: this.authToken,
			order_id: this.orderId,
			amount_cents: this.paymentData.amount_cents,
			currency: this.currency,
			integration_id: this.integrationId,
			expiration: 300,
			billing_data: {
				email: this.paymentData.email,
				first_name: this.paymentData.first_name,
				last_name: this.paymentData.last_name,
				phone_number: this.paymentData.phone,
				apartment: "NA",
				floor: "NA",
				street: "NA",
				building: "NA",
				shipping_method: "NA",
				postal_code: "NA",
				city: "NA",
				country: "NA",
				state: "NA",
			},
		};

		const res = await axios({
			method: "POST",
			url: "https://accept.paymob.com/api/acceptance/payment_keys",
			data,
		});
		if (res.status === 201) {
			this.paymentToken = res.data.token;
			return res.data;
		}
		throw new AppError("Something went wrong", 500);
	}
	iframeCardUrl() {
		return `${process.env.PAYMENT_IFRAME_CARD_URL}${this.paymentToken}`;
	}
}

module.exports = PaymentModel;

/*
success callback

https://accept.paymobsolutions.com/api/acceptance/post_pay?
id=165397396&
pending=false
&amount_cents=1000
&success=true
&is_auth=false
&is_capture=false
&is_standalone_payment=true
&is_voided=false
&is_refunded=false
&is_3d_secure=true
&integration_id=4143130
&profile_id=888707
&has_parent_transaction=false
&order=188085996
&created_at=2024-02-24T14%3A17%3A04.718260
&currency=EGP
&merchant_commission=0
&discount_details=%5B%5D
&is_void=false
&is_refund=false
&error_occured=false
&refunded_amount_cents=0
&captured_amount=0
&updated_at=2024-02-24T14%3A17%3A25.549604
&is_settled=false
&bill_balanced=false
&is_bill=false
&owner=1568098
&data.message=Approved
&source_data.type=card
&source_data.pan=2346
&source_data.sub_type=MasterCard
&acq_response_code=00
&txn_response_code=APPROVED
&hmac=ffe029b4c07fa0ba68e56d1d2410e88d2917483f2365d527b316a184168d3a6721d0d4736f32574881e35cba809847b9f33d65ec84842bb2b7084e8d0364837b
*/
