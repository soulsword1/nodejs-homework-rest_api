const express = require("express");
const router = express.Router();
const contacts = require('../../controllers/contacts');


/* GET users listing. */

router.get("/", contacts.getAll);

router.get("/:id", contacts.getById);

router.post("/", contacts.addContact);

router.delete("/:id", contacts.deleteContact);

router.put("/:id", contacts.changeContact);

module.exports = router;
