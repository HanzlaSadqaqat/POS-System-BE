const { Product } = require("../models/catalogue");

class productController {
  async createProduct(body) {
    try {
      console.log(body);
      const newProduct = await new Product({
        ...body,
      });
      newProduct.save();
      return {
        code: 201,
        message: "Product Created Successfully",
        data: newProduct,
      };
    } catch (error) {
      throw {
        code: 403,
        error: error,
      };
    }
  }

  async getProducts() {
    try {
      const products = await Product.find().populate("categoryId");
      const productsWithCategoryNames = products.map((product) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.categoryId
          ? product.categoryId.name
          : "Uncategorized",
      }));
      return {
        code: 200,
        message: "Data found successfully",
        data: productsWithCategoryNames,
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }

  async updateProduct(body, id, user) {
    try {
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
        throw {
          code: 401,
          message: "Only Admin can update",
        };
      }
      const findProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { ...body } },
        { new: true }
      );
      if (!findProduct) {
        throw {
          code: 404,
          message: "Product Not found",
        };
      }
      return {
        code: 200,
        message: "Updated successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }
  async deleteProduct(id, user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 401,
          message: "Only Admin can delete",
        };
      }
      const findProduct = await Product.findByIdAndDelete(id);
      if (!findProduct) {
        throw {
          code: 404,
          message: "Product Not found",
        };
      }
      return {
        code: 200,
        message: "Updated successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }
}

module.exports = productController;
