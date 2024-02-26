const ViewsController = require("../controllers/ViewsController");

const router = require("express").Router();

router.get("/", ViewsController.home);
router.get("/applications", ViewsController.applications);
router.get("/apply", ViewsController.apply);
router.get("/payment", ViewsController.payment);
router.get("/paied", ViewsController.paied);

module.exports = router;
