const express = require("express");
// const { nanoid } = require("nanoid");
const { Types } = require("mongoose");

const router = express.Router();
const {
  // listContacts,
  // getContactById,
  removeContact,
  // addContact,
  updateContact,
} = require("../../models/contacts");
const { catchAsync, contactValidators, HttpError } = require("../../utils");
const Contact = require("../../models/contactModel");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    // const contacts = await listContacts();

    const contacts = await Contact.find();

    res.status(200).json({
      status: "Success",
      contacts,
    });
  })
);

router.get(
  "/:contactId",
  catchAsync(async (req, res) => {
    const { contactId } = req.params;

    const idIsValid = Types.ObjectId.isValid(contactId);

    if (!idIsValid) {
      return res.status(404).json({ message: "Contact not found" });
    }
    // const contact = await getContactById(contactId);
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({
      status: "Success",
      contact,
    });
  })
);

router.post(
  "/",
  catchAsync(async (req, res) => {
    const { value, error } = contactValidators.createContactDataValidator(
      req.body
    );

    if (error)
      throw new HttpError(400, { message: "Missing required name field" });

    // const { name, email, phone } = value;

    // const body = {
    //   id: nanoid(),
    //   name: name,
    //   email: email,
    //   phone: phone,
    // };

    // await addContact(body);

    const newContact = await Contact.create(value);

    res.status(201).json({
      status: "Success",
      body: newContact,
    });
  })
);

router.delete(
  "/:contactId",
  catchAsync(async (req, res) => {
    const { contactId } = req.params;

    const contact = await removeContact(contactId);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      status: "Success",
      contact,
    });
  })
);

router.put(
  "/:contactId",
  catchAsync(async (req, res) => {
    const { contactId } = req.params;

    const { value, error } = contactValidators.updateContactDataValidator(
      req.body
    );

    if (error) throw new HttpError(400, { message: "Missing fields" });

    const { name, email, phone } = value;

    const body = { name, email, phone };

    const updateContacts = await updateContact(contactId, body);

    if (!updateContacts) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json({
      status: "Success",
      updateContacts,
    });
  })
);

module.exports = router;
