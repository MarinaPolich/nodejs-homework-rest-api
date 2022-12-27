const express = require("express");
const {
  getList,
  getContactId,
  validateForCreate,
  createContact,
  deleteContact,
  validateForUpdate,
  update,
  validateForUpdateStatus,
} = require("../../controllers/contacts");
const router = express.Router();

const catchErrors = (action) => (req, res, next) =>
  action(req, res).catch((e) => {
    console.error(e);
    next(e);
  });

router.get("/", catchErrors(getList));

router.get("/:contactId", catchErrors(getContactId));

router.post("/", validateForCreate(), catchErrors(createContact));

router.delete("/:contactId", catchErrors(deleteContact));

router.put("/:contactId", validateForUpdate(), catchErrors(update));

router.patch(
  "/:contactId/favorite",
  validateForUpdateStatus(),
  catchErrors(update)
);

module.exports = router;
