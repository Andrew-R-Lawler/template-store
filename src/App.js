import React, { useState, useEffect } from 'react';
import { commerce } from './lib/commerce';
import { Cart, Products, Navbar, Checkout } from './components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
    const [cart, setCart] = useState({});
    const [products, setProducts] = useState ([]);
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');


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

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
        setCart(newCart);
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
            setOrder(incomingOrder);
        } catch (error) {
            setErrorMessage(error.data.error.message);
        }
    }

    useEffect(() => {
        fetchCart();
        fetchProducts();
    }, []);

  return (
    <Router>
        <div>
                <Navbar cart={cart} />
            <Routes>
                <Route path='/' element={<Products products={products} onAddToCart={handleAddToCart}/>} />
                <Route path='/cart' element={<Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart} />} />
                <Route path='/checkout' element={<Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} error={errorMessage} />}/>
            </Routes>
        </div>
    </Router>
  )
}

export default App