import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';

import logo from '../../assets/commerce.png';
import useStyles from './styles';

const Navbar = ({ cart }) => {
    const classes = useStyles();
    const cartLoading = !cart;
    const location = useLocation();

    return (
        <>
            <AppBar position="fixed" className={classes.appBar} color="inherit">
                <Toolbar>
                    <Typography component={Link} to='/' variant="h6" className={classes.title} color="inherit">
                        <img src={logo} alt="Commerce.js" height="25px" className={classes.image} />
                        Commerce.js
                    </Typography>
                    <div className={classes.grow} />
                        { location.pathname === '/' && (
                            <div className={classes.button}>
                                <IconButton component={Link} to='/cart' aria-label="Show cart items" color="inherit">
                                    { cartLoading ? 
                                        <Badge badgeContent={0} color="secondary">
                                            <ShoppingCart />
                                        </Badge>
                                        :
                                        <Badge badgeContent={cart.total_items} color="secondary" overlap='rectangular'>
                                            <ShoppingCart />
                                        </Badge>
                                    }
                                </IconButton>
                            </div>
                        )}
                        
                </Toolbar>
            </AppBar>
        </>
  )
}

export default Navbar