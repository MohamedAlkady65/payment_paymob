const form = document.getElementById("form");

console.log(form);

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const [firstName, lastName, email, phone, amount] = [
		"first-name",
		"last-name",
		"email",
		"phone",
		"amount",
	].map((e) => document.getElementById(e).value);

	console.log([firstName, lastName, email, phone, amount]);

	await apply({ firstName, lastName, email, phone, amount });
});

const apply = async (data) => {
	try {
		const res = await axios({
			url: "/api/applications/",
			method: "POST",
			data,
		});
		if (res.data.status == "success") {
			showCode(res.data.paymentCode);
		} else {
			showAlert("error", "Something went wrong");
		}
	} catch (error) {
		showAlert(
			"error",
			error.response.data.message || "Something went wrong"
		);
	}
};

const showCode = (paymentCode) => {
	const con = document.querySelector(".row");

	con.insertAdjacentHTML(
		"afterend",
		`    <div class="success-apply">
    <p class="message">You have applied successfully</p>
    <p class="code">Your payment code: <span>${paymentCode}</span></p>
    <a href="./payment?paymentCode=${paymentCode}">Go Pay</a>
    </div>`
	);
};
