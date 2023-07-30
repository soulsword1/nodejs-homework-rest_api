const express = require("express");
const router = express.Router();
const contacts = require('../../controllers/contacts');
const isValidId = require('../../middlewares/isValidId');
const validateBody = require('../../middlewares/validateBody');
const authenticate = require('../../middlewares/authenticate');
const { schemas } = require("../../models/contact");


/* GET users listing. */

router.get("/",authenticate, contacts.getAll);

router.get("/:id",authenticate, isValidId, contacts.getById);

router.post("/",authenticate, validateBody(schemas.schemaPost), contacts.addContact);

router.delete("/:id",authenticate, isValidId, contacts.deleteContact);

router.put("/:id",authenticate, isValidId,validateBody(schemas.schemaPut), contacts.changeContact);

router.patch("/:id/favorite",authenticate, isValidId, contacts.changeFavorite);

module.exports = router;
