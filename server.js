const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app.js");

const PORT =  process.env.PORT;

const server = app.listen(PORT, () => {
	console.log(`App Listening on ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
	console.log("Unhandled Rejection 💥💥💥");

	console.log(err);
	console.log(err.name, err.message);

	server.close(() => {
		console.log("Shutting down ....");
		process.exit(1);
	});
});
