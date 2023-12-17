const { Types } = require("mongoose");

const Contact = require("../models/contactModel");
const { catchAsync, HttpError, contactValidators } = require("../utils");

exports.checkContactId = catchAsync(async (req, res, next) => {
  const { contactId } = req.params;

  const idIsValid = Types.ObjectId.isValid(contactId);

  if (!idIsValid) throw new HttpError(404, "Contact not found..");

  const contactExists = await Contact.exists({ _id: contactId });

  if (!contactExists) throw new HttpError(404, "Contact not found..");

  next();
});

exports.checkCreateContactData = catchAsync(async (req, res, next) => {
  const { value, error } = contactValidators.createContactDataValidator(
    req.body
  );

  if (error) throw new HttpError(400, "Invalid contact data!");

  const contactPhoneCheck = await Contact.exists({ phone: value.phone });
  const contactEmailCheck = await Contact.exists({ email: value.email });

  if (contactPhoneCheck) {
    throw new HttpError(409, "Contact with this phone already exists..");
  } else if (contactEmailCheck) {
    throw new HttpError(409, "Contact with this email already exists..");
  }

  req.body = value;

  next();
});

exports.checkUpdateContactData = catchAsync(async (req, res, next) => {
  const { value, error } = contactValidators.updateContactDataValidator(
    req.body
  );

  if (error) throw new HttpError(400, "Invalid contact data!");

  const contactExists = await Contact.exists({
    phone: value.phone,
    _id: { $ne: req.params.contactId },
  });

  if (contactExists)
    throw new HttpError(409, "Contact with this phone already exists..");

  req.body = value;

  next();
});

exports.checkStatusContactData = catchAsync(async (req, res, next) => {
  const { value, error } = contactValidators.updateContactStatusValidator(
    req.body
  );
  if (error) throw new HttpError(400, "Invalid contact data!");

  req.body = value;

  next();
});
