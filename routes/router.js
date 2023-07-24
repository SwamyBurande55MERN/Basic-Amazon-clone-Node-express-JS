const express = require("express");
const router = express.Router();
const products = require("../model/ProductSchema.js");
const User = require("../model/UserSchema.js");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const authenticate = require("../middlewares/authenticate.js");

// get all product's data
router.get("/getAllProducts", async (req, res) => {      // getproducts
      try {
            const productsData = await products.find();
            // console.log(`Products data : ${productsData}`);
            res.status(201).json(productsData);
      } catch (error) {
            console.log("error" + error.message);
      }
});

router.get("/getSingleProduct/:id", async (req, res) => {
      try {
            const { id } = req.params;
            // console.log(id);
            const individual = await products.findOne({ id: id });
            // console.log(individual + "Individual data received successfully");
            res.status(201).json(individual);
      } catch (error) {
            res.status(400).json(error);
      }
});


// register the user
router.post("/register", async (req, res) => {
      // console.log(req.body);
      const { fname, email, mobile, password, cpassword } = req.body;
      if (!fname) {
            return res.status(400).json({ error: "First Name is required" });
      };
      if (!email) {
            return res.status(400).json({ error: "Email is required" });
      };
      if (!mobile) {
            return res.status(400).json({ error: "Mobile number is required" });
      };
      if (!password) {
            return res.status(400).json({ error: "Password is required" });
      };
      if (!cpassword) {
            return res.status(400).json({ error: "Confirm passwod is required" });
      };

      try {
            const previousUser = await User.findOne({ email: email });

            if (previousUser) {
                  return res.status(422).json({ error: "Email already registered" });
            } else if (password !== cpassword) {
                  return res.status(422).json({ error: "Passwords does not match" });;
            } else {
                  const registerNewUser = new User({
                        fname, email, mobile, password, cpassword
                  });
                  const storedata = await registerNewUser.save();
                  // console.log(storedata + "user successfully added");
                  res.status(201).json(storedata);
            }
      } catch (error) {
            console.log("error in catch block registeration" + error.message);
            return res.status(422).send(error);
      }
});

// login user
router.post("/login", async (req, res) => {
      const { email, password } = req.body;
      if (!email) {
            return res.status(400).json({ error: "Email is required" });
      };
      if (!password) {
            return res.status(400).json({ error: "Password is required" });
      };
      try {
            const userLogin = await User.findOne({ email: email });

            if (userLogin) {
                  const isMatch = await bcrypt.compare(password, userLogin.password);
                  // token generation
                  if (!isMatch) {
                        return res.status(400).json({ error: `Invalid credentials` });
                  } else {
                        const token = await userLogin.generateAuthToken();
                        console.log(token);

                        // cookie generation
                        res.cookie("eccomerce", token, {
                              expires: new Date(Date.now() + 900000),
                              httpOnly: true
                        });
                        res.status(201).json(`User logged-in Successfully`);
                  }
            } else {
                  res.status(400).json({ error: `Unregistered user, please register first!` });
            }
      } catch (error) {
            res.status(400).json(`Invalid credentials`);
            console.log(error, `error in catch block`);
      }
});

// adding the data into cart
router.post("/addcart/:id", authenticate, async (req, res) => {
      try {
            // console.log("perfect 6");
            const { id } = req.params;
            const cart = await products.findOne({ id: id });
            console.log(cart + "cart value");

            const Usercontact = await User.findOne({ _id: req.userID });
            console.log(Usercontact + "user value");

            if (Usercontact) {
                  const cartData = await Usercontact.addcartdata(cart);
                  console.log(cartData);
                  await Usercontact.save();
                  res.status(201).json(Usercontact);
            } else {
                  res.status(401).json({ error: `Invalid user in add to cart` })
            }
      } catch (error) {
            console.log(error, "Invalid user in add to cart");
      }
});



module.exports = router;