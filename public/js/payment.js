const form = document.getElementById("form");

let methodValue = "card";
for (method of document.getElementsByName("method")) {
	method.addEventListener("change", function () {
		methodValue = this.value;
		if (methodValue == "card") {
			document.getElementById("phone").remove();
		} else {
			document
				.querySelector("button")
				.insertAdjacentHTML(
					"beforebegin",
					`<input type='text', placeholder='Phone' id="phone" required/>`
				);
		}
		console.log(this.value);
	});
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const paymentCode = document.getElementById("paymentCode").value;

	const phoneField = document.getElementById("phone");

	let phone;
	if (phoneField) {
		phone = phoneField.value;
	}

	await pay(paymentCode, methodValue, phone);
});

const pay = async (paymentCode, method, phone) => {
	try {
		const res = await axios({
			url: `/api/payment/code/${paymentCode}?method=${method}`,
			method: "POST",
			data: {
				phone,
			},
		});

		if (res.data.status == "success") {
			if (res.data.data) {
				redirctUrl(res.data.data);
			} else {
				showAlert("error", "Please provide valid phone number");
			}
		} else {
			showAlert("error", "Something went wrong");
		}
	} catch (error) {
		console.log(error);
		showAlert(
			"error",
			error.response.data.message || "Something went wrong"
		);
	}
};

const redirctUrl = (url) => {
	location.assign(url);
};
