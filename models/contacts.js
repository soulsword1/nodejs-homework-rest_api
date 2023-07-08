const fs = require("fs").promises;
const path = require("path");
const randomId = require("random-id");

const len = 30;
const pattern = "aA0";

const contactsPath = path.join(__dirname, "/contacts.json");

// TODO: задокументировать каждую функцию
const listContacts = async () => {
  const getContacts = await fs.readFile(contactsPath);
  return JSON.parse(getContacts);
};

const getContactById = async (contactId) => {
  const getContacts = await listContacts();
  const contact = getContacts.find(({ id }) => id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const getContacts = await listContacts();
  const contact = getContacts.find(({ id }) => id === contactId);
  return contact || null;
};

const addContact = async (name, email, phone) => {
  const getContacts = await listContacts();
  const id = randomId(len, pattern);
  const data = {
    id,
    name,
    email,
    phone,
  };
  const newContacts = JSON.stringify([...getContacts, data], null, 2);
  await fs.writeFile(contactsPath, newContacts);
  return data;
};

const updateContact = async (contactId, body) => {
  const getContacts = await listContacts();
  const contact = getContacts.find(({ id }) => id === contactId);
  const newGetContacts = getContacts.filter(({ id }) => id !== contact.id);
  const newContact = { ...contact, ...body };
  const newContacts = JSON.stringify([...newGetContacts, newContact], null, 2);
  await fs.writeFile(contactsPath, newContacts);

  return newContact || null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
