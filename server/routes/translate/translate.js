const express = require("express");
const router = express.Router();
const { translator } = require("./controller/translateController");

router.post("/translate", translator);

module.exports = router;
