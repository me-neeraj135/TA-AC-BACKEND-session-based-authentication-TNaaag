/** @format */

let mongoose = require(`mongoose`);
let bcrypt = require(`bcrypt`);

let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },

    password: { type: String, minlength: 5, required: true },
  },
  { timestamps: true }
);

userSchema.pre(`save`, function (next) {
  if (this.password && this.isModified(`password`)) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model(`User`, userSchema);
