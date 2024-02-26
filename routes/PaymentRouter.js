const PaymentController = require("../controllers/PaymentController");

const router = require("express").Router();

router.route("/callback").post(PaymentController.callback);
router.route("/code/:code").post(PaymentController.payWithCode);

module.exports = router;
