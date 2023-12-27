const { User } = require("../models");
const { jwtServices } = require("../services");
const { catchAsync, HttpError } = require("../utils");

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  const token = jwtServices.registerToken(newUser.id);

  newUser.token = token;

  res.status(201).json({
    status: "Success",
    body: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new HttpError(401, "Email or password is wrong");
  }

  const passwordIsValid = await user.checkPassword(password, user.password);

  if (!passwordIsValid) {
    throw new HttpError(401, "Email or password is wrong");
  }

  user.password = undefined;

  const token = jwtServices.registerToken(user.id);

  await User.findByIdAndUpdate(user._id, { token });
  user.token = token;

  res.status(200).json({
    status: "Success",
    user,
  });
});

exports.currentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    status: "Success",
    user: {
      email,
      subscription,
    },
  });
};

exports.logout = catchAsync(async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });

  res.status(204).send();
});
