const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes/router.js");
const Products = require("./model/ProductSchema.js");
const DefaultData = require("./defaultData.js");
const cookieParser = require("cookie-parser");
const port = process.env.port || 9000;
const mongoUrl = process.env.mongo_URL;

// DefaultData();

app.use(express.json());
app.use(cookieParser(process.env.secretKey));
app.use(cors({
      origin: "http://localhost:3000",
      credentials: true
}));
app.use(router);

mongoose.connect(mongoUrl, {
      useNewUrlParser: true
}).then(() => {
      console.log(`Connection with db, established successfully`);
}).catch(() => {
      console.log(`error conecting to the db`);
})

app.get("/", (req, res) => {
      return res.status(201).send({ 'message': `Welcome the Home page`, success: true });
})
app.listen(port, () => {
      console.log(`Server is listening to port : ${port}`);
})

DefaultData();