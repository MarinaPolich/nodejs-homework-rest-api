const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../servises/contacts");
const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).required();

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone");

const updateSchemaStatus = Joi.object({
  favorite: Joi.boolean().required(),
}).required();

const validator = (schema, message) => (req, res, next) => {
  const body = req.body;
  console.log("body", body);
  const validation = schema.validate(body);

  if (validation.error) {
    res.status(400).json({ message });
    return;
  }

  return next();
};

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
  res.json(await listContacts());
};

const getContactId = async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await getById(contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.json(contact);
};

const createContact = async (req, res, next) => {
  const contact = req.body;
  res
    .status(201)
    .json(
      await addContact({ ...contact, favorite: contact.favorite ?? false })
    );
};

const deleteContact = async (req, res, next) => {
  const contactId = req.params.contactId;
  const isRemoveContact = await removeContact(contactId);
  if (!isRemoveContact) {
    res.status(404).json({ message: "Not found" });
    return;
  }
  res.status(201).json({ message: "contact deleted" });
};

const update = async (req, res, next) => {
  const contactId = req.params.contactId;
  const contact = await updateContact(contactId, req.body);
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
