require("dotenv").config();
const http = require("http");
const express = require("express");
const app = express();
const validation = require("./validation.js");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const session = require("express-session");
const flash = require("express-flash");
const passportConfig = require("./passport-config");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(
	session({
		secret: process.env.cookieSecret,
		resave: true,
		saveUninitialized: false,
		cookie: { maxAge: 1.21e9 }, //set cookie to expire in 14 days
	})
);
app.use(flash());
passportConfig.init(app);
app.use(logger("dev"));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

if (process.env.NODE_ENV === "test") {
	const mockAuth = require("../spec/support/mock-auth.js");
	mockAuth.fakeIt(app);
}

const port = process.env.PORT || "3000";
app.set("port", port);

// Controllers
const userController = require("./controllers/userController.js");

// Routes -- User

// app.get("/users");
app.post("/users/sign_up", validation.validateUsers, userController.create);
app.post("/users/sign_in", validation.validateUsers, userController.signIn);
app.get("/users/sign_out", userController.signOut);

// Routes -- Game

// Routes -- Questions

// Routes -- Answers

const server = http.createServer(app);
server.listen(port);

server.on("listening", () => {
	console.log(`Server is listening for requests on port ${server.address().port}`);
});

module.exports = server;
