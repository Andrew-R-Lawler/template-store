import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Cart, Products, Navbar, Checkout } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    const [cart, setCart] = useState({});
    const [products, setProducts] = useState ([]);

    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data);
    };

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve());
    };

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);
        fetchCart();
    };

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, {quantity});
        fetchCart();
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId);
        fetchCart();
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
        fetchCart();
    }

    useEffect(() => {
        fetchCart([]);
        fetchProducts();
    }, []);

  return (
    <Router>
        <div>
                <Navbar cart={cart} />
            <Routes>
                <Route path='/' element={<Products products={products} onAddToCart={handleAddToCart}/>} />
                <Route path='/cart' element={<Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart} />} />
            </Routes>
        </div>
    </Router>
  )
}

export default App