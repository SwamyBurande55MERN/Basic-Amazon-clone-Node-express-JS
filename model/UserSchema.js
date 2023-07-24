const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey

const userSchema = new mongoose.Schema({
      fname: {
            type: String,
            required: true,
            trim: true
      },
      email: {
            type: String,
            required: true,
            unique: true,
            validate(value) {
                  if (!validator.isEmail(value)) {
                        throw new Error("invalid Email Id");
                  }
            }
      },
      mobile: {
            type: String,
            required: true,
            unique: true,
            maxLength: 10
      },
      password: {
            type: String,
            required: true,
            minlength: 6
      },
      cpassword: {
            type: String,
            required: true,
            minlength: 6
      },
      tokens: [
            {
                  token: {
                        type: String,
                        required: true
                  }
            }
      ],
      carts: Array  // []
});


// password hasing 
userSchema.pre("save", async function (next) {
      if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
            this.cpassword = await bcrypt.hash(this.cpassword, 10);
      }
      next();
});


// generting token
userSchema.methods.generateAuthToken = async function () {
      try {
            let token = jwt.sign({ _id: this._id }, secretKey, {
                  expiresIn: "1d"
            });
            this.tokens = this.tokens.concat({ token: token });
            await this.save();
            return token;
      } catch (error) {
            console.log(error);
      }
}

// addto cart data
userSchema.methods.addcartdata = async function (cart) {
      try {
            this.carts = this.carts.concat(cart);
            await this.save();
            return this.carts;
      } catch (error) {
            console.log(error + "error while adding product to cart");
      }
}

const User = new mongoose.model("USER", userSchema);  // USER is Uppercase, because some Node modules add an "s" at teh end of the USER if it is in Lower case
module.exports = User;