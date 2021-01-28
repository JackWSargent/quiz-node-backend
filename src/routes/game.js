const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const helper = require("../auth/helpers");
router.get("/games", gameController.index);
router.post("/games/create", helper.ensureAuthenticated, gameController.create);
router.post("/games/:id/destroy", gameController.destroy);
router.post("/games/:id/update", gameController.update);

export default router;
