const AppliactionsController = require("../controllers/AppliactionsController");

const router = require("express").Router();

router
	.route("/")
	.post(AppliactionsController.add)
	.get(AppliactionsController.getAll);

module.exports = router;
