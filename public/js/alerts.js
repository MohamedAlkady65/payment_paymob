const hideAlert = () => {
	document.querySelector(".alert").remove();
};
const showAlert = (type, msg) => {
	const popUp = `<div class="alert alert--${type}" >${msg}</div>`;
	document.body.insertAdjacentHTML("afterbegin", popUp);
	window.setTimeout(hideAlert, 2000);
};
