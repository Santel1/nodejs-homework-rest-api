const { User } = require("../models");
const { jwtServices, ImageService } = require("../services");
const { catchAsync, userValidators, HttpError } = require("../utils");

exports.checkRegisterData = catchAsync(async (req, res, next) => {
  const { value, error } = userValidators.registerUserDataValidator(req.body);

  if (error) {
    throw new HttpError(400, "Invalid user data");
  }

  const contactEmailCheck = await User.exists({ email: value.email });

  if (contactEmailCheck) {
    throw new HttpError(409, "Email in use");
  }

  req.body = value;

  next();
});

exports.checkLoginData = (req, res, next) => {
  const { value, error } = userValidators.loginUserDataValidator(req.body);

  if (error) {
    throw new HttpError(401, "Email or password is wrong");
  }

  req.body = value;

  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  const userId = jwtServices.checkToken(token);

  if (!userId) {
    throw new HttpError(401, "Not authorized");
  }

  const currentUser = await User.findById(userId);

  if (!currentUser || !currentUser.token || currentUser.token !== token) {
    throw new HttpError(401, "Not authorized");
  }

  req.user = currentUser;

  next();
});

exports.updateUserAvatar = ImageService.initUpdateImageMiddleware("avatar");
