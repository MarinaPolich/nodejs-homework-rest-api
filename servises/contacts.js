const Contacts = require("./schemas/contacts");

async function listContacts() {
  return Contacts.find();
}

async function getById(contactId) {
  return Contacts.findOne({ _id: contactId });
}

async function removeContact(contactId) {
  return Contacts.findByIdAndRemove({ _id: contactId });
}

async function addContact(data) {
  return Contacts.create(data);
}

async function updateContact(contactId, data) {
  return Contacts.findByIdAndUpdate({ _id: contactId }, data, { new: true });
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
