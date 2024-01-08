const { model, Schema } = require("mongoose");

const { genSalt, hash, compare } = require("bcrypt");

const crypto = require("crypto");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");
    this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=identicon`;
  }

  if (!this.isModified("password")) return next();

  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);

  next();
});

// userSchema.pre(/^find/, () => {
//   console.log('FIND');
// });

userSchema.methods.checkPassword = (candidate, passwdHash) =>
  compare(candidate, passwdHash);

const User = model("User", userSchema);

module.exports = User;
