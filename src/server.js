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
const helper = require("../auth/helpers");
const port = process.env.PORT || "3000";
app.set("port", port);

// Controllers
const userController = require("./controllers/userController.js");
const gameController = require("./controllers/gameController.js");
const questionController = require("./controllers/questionController.js");

// Routes -- User

app.get("/users", userController.retrieveUsers);
app.post("/users/sign_up", validation.validateUsers, userController.create);
app.post("/users/sign_in", validation.validateUsers, userController.signIn);
app.get("/users/sign_out", userController.signOut);

// Routes -- Game

router.get("/games", gameController.index);
router.post("/games/create", helper.ensureAuthenticated, gameController.create);
router.post("/games/:id/destroy", gameController.destroy);
router.post("/games/:id/update", gameController.update);

// Routes -- Questions

router.get("/questions", questionController.index);
router.post("/questions/create", helper.ensureAuthenticated, questionController.create);
router.post("/questions/:id/destroy", questionController.destroy);
router.post("/questions/:id/update", questionController.update);

// Routes -- Answers

router.get("/answers", answerController.index);
router.post("/answers/create", helper.ensureAuthenticated, answerController.create);
router.post("/answers/:id/destroy", answerController.destroy);
router.post("/answers/:id/update", answerController.update);

const server = http.createServer(app);
server.listen(port);

server.on("listening", () => {
	console.log(`Server is listening for requests on port ${server.address().port}`);
});

module.exports = server;
