import cartModel from './models/cart.model.js';

class CartManager {
    async addCart(cart) {
        try {
            const newCart = await cartModel.create(cart);
            return newCart;
        } catch (error) {
            console.error('Error adding cart:', error);
        }
    }

    async getCarts() {
        try {
            const carts = await cartModel.find({});
            return carts;
        } catch (error) {
            console.error('Error fetching carts:', error);
        }
    }

    async getCart(id) {
        try {
            const cart = await cartModel.findById(id);
            return cart;
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }

    async updateCart(id, updateFields) {
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(id, updateFields, { new: true });
            return updatedCart;
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }

    async deleteCart(id) {
        try {
            const deletedCart = await cartModel.findByIdAndDelete(id);
            return deletedCart;
        } catch (error) {
            console.error('Error deleting cart:', error);
        }
    }
}

export default CartManager;
