const express = require("express");
const { contactController } = require("../../controllers");
const { contactMiddleware } = require("../../middlewares");

const router = express.Router();

router.get("/", contactController.getAllContacts);
router.post(
  "/",
  contactMiddleware.checkCreateContactData,
  contactController.addContact
);
router.get(
  "/:contactId",
  contactMiddleware.checkContactId,
  contactController.getContact
);
router.put(
  "/:contactId",
  contactMiddleware.checkContactId,
  contactMiddleware.checkUpdateContactData,
  contactController.updateContact
);
router.delete(
  "/:contactId",
  contactMiddleware.checkContactId,
  contactController.deleteContact
);
router.patch(
  "/:contactId/favorite",
  contactMiddleware.checkContactId,
  contactMiddleware.checkStatusContactData,
  contactController.updateStatusContact
);

module.exports = router;
