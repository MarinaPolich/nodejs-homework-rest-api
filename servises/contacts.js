const Contacts = require("./schemas/contacts");

async function listContacts({ skip, limit, ...filter }) {
  return Contacts.find(filter).skip(skip).limit(limit);
}

async function getById(contactId, owner) {
  return Contacts.findOne({ _id: contactId, owner });
}

async function removeContact(contactId, owner) {
  return Contacts.findByIdAndRemove({ _id: contactId, owner });
}

async function addContact(data) {
  return Contacts.create(data);
}

async function updateContact(contactId, owner, data) {
  return Contacts.findByIdAndUpdate({ _id: contactId, owner }, data, {
    new: true,
  });
}

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
