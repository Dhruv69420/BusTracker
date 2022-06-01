const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    console.log("heloo from inside");
    this.password = bcrypt.hashSync(this.password, salt);
  }
  next();
});

userSchema.methods.generateAuthToken = function () {
  let token = jwt.sign({ _id: this._id }, process.env.SECRET);
  this.tokens = this.tokens.concat({ token: token });
  this.save()
    .then(() => {
      res.status(201).json({ message: "token added" });
    })
    .catch((err) => res.status(500).json({ error: "token addition failed" }));
  return token;
};

const User = mongoose.model("USER", userSchema);

module.exports = User;
