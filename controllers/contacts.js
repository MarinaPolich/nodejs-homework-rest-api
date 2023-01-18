const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../servises/contacts");
const { validator } = require("../utils/validator");
const {
  createSchema,
  updateSchema,
  updateSchemaStatus,
} = require("./schema/contacts");

const validateForCreate = () => {
  return validator(createSchema, "missing required name field");
};

const validateForUpdate = () => {
  return validator(updateSchema, "missing fields");
};

const validateForUpdateStatus = () => {
  return validator(updateSchemaStatus, "missing field favorite");
};

const getList = async (req, res, next) => {
  const query = req.query;
  res.json(await listContacts({ ...query, owner: req.user._id }));
};

const getContactId = async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await getById(contactId, req.user._id);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(contact);
};

const createContact = async (req, res, next) => {
  const contact = req.body;
  res.status(201).json(
    await addContact({
      ...contact,
      owner: req.user._id,
      favorite: contact.favorite ?? false,
    })
  );
};

const deleteContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const isRemoveContact = await removeContact(contactId, req.user._id);
  if (!isRemoveContact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(201).json({ message: "contact deleted" });
};

const update = async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await updateContact(contactId, req.user._id, req.body);
  if (contact !== null) {
    res.json(contact);
    return;
  }
  res.status(404).json({ message: "Not found" });
};

module.exports = {
  getList,
  getContactId,
  createContact,
  deleteContact,
  update,
  validateForCreate,
  validateForUpdate,
  validateForUpdateStatus,
};
