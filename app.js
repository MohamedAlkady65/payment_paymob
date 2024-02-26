const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const GlobalErrorHandler = require("./controllers/ErrorController.js");
const AppError = require("./utils/appError.js");
const PaymentRouter = require("./routes/PaymentRouter.js");
const ApplicationsRouter = require("./routes/ApplicationsRouter.js");
const ViewsRouter = require("./routes/ViewsRouter.js");
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.ENV == "development") {
	app.use(morgan("dev"));
}

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", ViewsRouter);

app.use("/api/payment", PaymentRouter);
app.use("/api/applications", ApplicationsRouter);

app.all("*", (req, res, next) => {
	next(
		new AppError(
			`Route ${req.originalUrl} with method ${req.method} is not found`,
			404
		)
	);
});

app.use(GlobalErrorHandler);

module.exports = app;
