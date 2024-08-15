import productModel from './models/product.model.js';

class ProductManager {
    async addProduct(product) {
        try {
            const newProduct = await productModel.create(product);
            return newProduct;
        } catch (error) {
            console.error('Error adding product:', error);
        }
    }

    async getProducts() {
        try {
            const products = await productModel.find({});
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async getProduct(id) {
        try {
            const product = await productModel.findById(id);
            return product;
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    async updateProduct(id, updateFields) {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(id, updateFields, { new: true });
            return updatedProduct;
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productModel.findByIdAndDelete(id);
            return deletedProduct;
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

export default ProductManager;




