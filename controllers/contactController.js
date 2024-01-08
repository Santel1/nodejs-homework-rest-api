const Contact = require("../models/contactModel");
const { catchAsync } = require("../utils");

exports.getAllContacts = catchAsync(async (req, res) => {
  const query = req.query;

  const owner = req.user;

  const findOptions = query.search
    ? {
        $or: [
          { name: { $regex: query.search, $options: "i" }, owner: owner.id },
          { phone: { $regex: query.search, $options: "i" }, owner: owner.id },
        ],
      }
    : {};

  if (query.search && owner.id) {
    for (const findOption of findOptions.$or) findOption.owner = owner;
  }

  if (!query.search && owner.id) {
    findOptions.owner = owner;
  }

  const contactsQuery = Contact.find(findOptions).populate(
    "owner",
    "id email subscription"
  );

  contactsQuery.sort(
    `${query.order === "DESC" ? "-" : ""}${query.sort ?? "name"}`
  );

  const paginationPage = query.page ? +query.page : 1;
  const paginationLimit = query.limit ? +query.limit : 10;
  const contactsToSkip = (paginationPage - 1) * paginationLimit;

  contactsQuery.skip(contactsToSkip).limit(paginationLimit);

  const contacts = await contactsQuery;

  const total = await Contact.countDocuments(findOptions);

  res.status(200).json({
    contacts,
    total,
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
  const { email, name, phone } = req.body;
  const owner = req.user;

  const newContact = await Contact.create({ email, name, phone, owner });

  res.status(201).json({
    _id: newContact.id,
    name: newContact.name,
    email: newContact.email,
    phone: newContact.phone,
    favorite: newContact.favorite,
  });
});

exports.deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;

  await Contact.findByIdAndDelete(contactId);

  res.status(200).json({
    message: "Contact deleted",
  });
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
