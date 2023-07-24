const jwt = require("jsonwebtoken");
const User = require(".././model/UserSchema.js");
require("dotenv").config();
const secretKey = process.env.secretKey;

const authenticate = async (req, res, next) => {
      try {
            const token = req.cookies.eccomerce;
            const verifyToken = jwt.verify(token, secretKey);
            console.log(verifyToken);

            const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
            console.log(rootUser);

            if (!rootUser) {
                  throw new Error("User not found");
            }

            req.token = token;
            req.rootUser = rootUser;
            req.userID = rootUser._id;
            next();
      } catch (err) {
            res.status(401).json({ unAuthorizedUSer: `No token provided` });
            console.log(err);
      }
}

module.exports = authenticate;

// const jwt = require("jsonwebtoken");
// const User = require("../model/UserSchema.js");
// const secretKey = process.env.secretKey;

// const authenticate = async (req, res, next) => {
//       try {
//             const token = req.cookies.eccomerce;
//             const verifyToken = jwt.verify(token, secretKey);
//             const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

//             if (!rootUser) { throw new Error("User Not Found") };

//             req.token = token;
//             req.rootUser = rootUser;
//             req.userID = rootUser._id;
//             next();
//       } catch (error) {
//             res.status(401).send("Unauthorized:Tokens not Provided!");
//             console.log(error);
//       }
// };

// module.exports = authenticate;