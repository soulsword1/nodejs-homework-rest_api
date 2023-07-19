const express = require("express");
const router = express.Router();
const contacts = require('../../controllers/contacts');
const isValidId = require('../../middlewares/isValidId');


/* GET users listing. */

router.get("/", contacts.getAll);

router.get("/:id",isValidId, contacts.getById);

router.post("/", contacts.addContact);

router.delete("/:id",isValidId, contacts.deleteContact);

router.put("/:id",isValidId, contacts.changeContact);

router.patch("/:id/favorite",isValidId, contacts.changeFavorite);

module.exports = router;
