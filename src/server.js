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
const helper = require("./auth/helpers");
const port = process.env.PORT || "3000";
app.set("port", port);

// Controllers
const userController = require("./controllers/userController.js");
const gameController = require("./controllers/gameController.js");
const questionController = require("./controllers/questionController.js");
const answerController = require("./controllers/answerController.js");
const gameSessionController = require("./controllers/gameSessionController.js");

// Routes -- User

app.get("/users", userController.retrieveUsers);
app.post("/users/sign_up", validation.validateUsers, userController.create);
app.post("/users/sign_in", validation.validateUsers, userController.signIn);
app.get("/users/sign_out", userController.signOut);

// Routes -- Game

app.get("/games", gameController.index);
app.get("/game/:id", gameController.getGame);
app.post(
	"/games/create",
	// helper.ensureAuthenticated,
	gameController.create
);
app.post("/build_game", gameController.buildGame);
app.post("/games/:id/destroy", gameController.destroy);
app.post("/games/:id/update", gameController.update);

// Routes -- Questions

app.get("/questions", questionController.index);
app.post("/questions/create", helper.ensureAuthenticated, questionController.create);
app.post("/questions/:id/destroy", questionController.destroy);
app.post("/questions/:id/update", questionController.update);

// Routes -- Answers

app.get("/answers", answerController.index);
app.post("/answers/create", helper.ensureAuthenticated, answerController.create);
app.post("/answers/:id/destroy", answerController.destroy);
app.post("/answers/:id/update", answerController.update);

// Routes -- Game Session

app.get("/gameSessions", gameSessionController.index);
app.post("/gameSessions/create", helper.ensureAuthenticated, gameSessionController.create);
app.post("/gameSessions/:id/destroy", gameSessionController.destroy);
app.post("/gameSessions/:id/update", gameSessionController.update);

const server = http.createServer(app);
server.listen(port);

server.on("listening", () => {
	console.log(`Server is listening for requests on port ${server.address().port}`);
});

module.exports = server;
