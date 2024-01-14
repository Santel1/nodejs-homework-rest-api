const { User } = require("../models");
const { jwtServices, ImageService } = require("../services");
const { catchAsync, HttpError } = require("../utils");
const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");

exports.register = catchAsync(async (req, res, next) => {
  const verificationToken = nanoid();

  const newUser = await User.create({ ...req.body, verificationToken });

  const { email, subscription } = newUser;
  newUser.password = undefined;

  const token = jwtServices.registerToken(newUser.id);

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      auth: {
        user: process.env.USER_MAILGUN,
        pass: process.env.PASS_MAILGUN,
      },
    });

    const emailConfig = {
      from: "Register <admin@example.com>",
      to: email,
      subject: "Verify email",
      text: "Confirm regestration.",
      html: `<a targer="_blank" href='http://localhost:3001/api/users/verify/${verificationToken}'>Click verify email</a>`,
    };

    await transporter.sendMail(emailConfig);
  } catch (error) {
    console.log(error.message);
  }

  res.status(201).json({
    token,
    email,
    subscription,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email }).select("+password");

  if (!user.verify) {
    throw new HttpError(401, "Email not verified");
  }

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

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
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

exports.updateUserAvatar = catchAsync(async (req, res) => {
  const user = req.user;
  const file = req.file;

  if (file) {
    const newAvatar = await ImageService.saveImage(
      file,
      {},
      "avatars",
      user.id
    );

    const updateUserAvatar = await User.findByIdAndUpdate(
      user,
      { avatarURL: newAvatar },
      { new: true }
    );

    res.status(200).json({
      avatarURL: updateUserAvatar.avatarURL,
    });
  }
});

exports.verifyByToken = catchAsync(async (req, res) => {
  const token = req.params.verificationToken;

  const user = await User.findOneAndUpdate(
    { verificationToken: token },
    { verificationToken: null, verify: true }
  );
  if (!user) {
    throw new HttpError(404, "User Not Found");
  }

  res.status(200).json({
    message: "Verification successful",
  });
});

exports.verifyByEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  if (user.verify) {
    throw new HttpError(400, "Verification has already been passed");
  }

  if (!user) {
    throw new HttpError(404, "User Not Found");
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailgun.org",
      port: 587,
      auth: {
        user: process.env.USER_MAILGUN,
        pass: process.env.PASS_MAILGUN,
      },
    });

    const emailConfig = {
      from: "Register <admin@example.com>",
      to: email,
      subject: "Verify email",
      text: "Confirm regestration.",
      html: `<a targer="_blank" href='http://localhost:3001/api/users/verify/${user.verificationToken}'>Click verify email</a>`,
    };

    await transporter.sendMail(emailConfig);
  } catch (error) {
    console.log(error.message);
  }

  res.status(200).json({
    message: "Verification email sent",
  });
});
