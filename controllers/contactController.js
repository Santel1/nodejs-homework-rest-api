const Contact = require("../models/contactModel");
const { catchAsync } = require("../utils");

exports.getAllContacts = catchAsync(async (req, res) => {
  const contacts = await Contact.find();

  res.status(200).json({
    status: "Success",
    contacts,
  });
});

exports.getContact = catchAsync(async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);

  res.status(200).json({
    status: "Success",
    contact,
  });
});

exports.addContact = catchAsync(async (req, res) => {
  const newContact = await Contact.create(req.body);

  res.status(201).json({
    status: "Success",
    body: newContact,
  });
});

exports.deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  await Contact.findByIdAndDelete(contactId);

  res.sendStatus(204);
});

exports.updateContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;

  const updateContact = await Contact.findByIdAndUpdate(
    contactId,
    {
      name,
      email,
      phone,
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    updateContact,
  });
});

exports.updateStatusContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const updateFavoriteContact = await Contact.findByIdAndUpdate(
    contactId,
    {
      favorite,
    },
    { new: true }
  );

  res.status(200).json({
    status: "Success",
    updateFavoriteContact,
  });
});
