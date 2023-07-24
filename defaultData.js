const productdata = require("./constant/ProductsData.js");
const Products = require("./model/ProductSchema.js");

const DefaultData = async () => {
      try {
            await Products.deleteMany({}); // because every time te below line executes, again all products will be added to the Collection
            const storeData = await Products.insertMany(productdata);
            console.log(storeData);
      } catch (error) {
            console.log("error" + error.message);
      }
};

module.exports = DefaultData;