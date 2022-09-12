import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography, TextField } from '@material-ui/core';
import { useForm, FormProvider, setValue } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { commerce } from '../../lib/commerce';

const AddressForm = ({ checkoutToken, cart, next, nextStep }) => {
    const [shippingCountries, setShippingCountries] = useState([]);
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
    const [shippingSubdivision, setShippingSubdivision] = useState('');
    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');


    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name }));
    const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name }));
    const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`}))


    const fetchShippingCountries = async (checkoutToken) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutToken.id);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0])
    }

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setShippingSubdivisions(subdivisions);
        setShippingSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutToken, { country, region});
        setShippingOptions(options);
        setShippingOption(options[0].id)
    }



    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }, [cart])

    useEffect(() => {
        if(shippingCountry) fetchSubdivisions(shippingCountry);
    }, [shippingCountry]);

    useEffect(() => {
        if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }, [shippingSubdivision])

    const handleFirstNameChange = event => {
        setFirstName(event.target.value);
      };
    
    const handleLastNameChange = event => {
        setLastName(event.target.value);
    };

    const handleAddress1Change = event => {
        setAddress1(event.target.value);
    };
    
    const handleEmailChange = event => {
        setEmail(event.target.value);
        };

    const handleCityChange = event => {
        setCity(event.target.value);
        };

    const handleZipChange = event => {
        setZip(event.target.value);
        };

  return (
    <>
        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(() => next({ firstName, lastName, address1, email, city, zip, shippingCountry, shippingSubdivision, shippingOption }))}>
                <Grid container spacing = {3}>
                    <TextField required name="firstName" label="First Name" onChange={handleFirstNameChange} value={firstName} />
                    <TextField required name="lastName" label="Last Name" onChange={handleLastNameChange} value={lastName}/>
                    <TextField required name="address1" label="Address" onChange={handleAddress1Change} value={address1} />
                    <TextField required name="email" label="E-Mail" onChange={handleEmailChange} value={email} />
                    <TextField required name="city" label="City" onChange={handleCityChange} value={city} />
                    <TextField required name="zip" label="ZIP / Postal Code" onChange={handleZipChange} value={zip} />
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Country</InputLabel>
                        <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                            {countries.map((country) => (
                                <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Subdivision</InputLabel>
                        <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                            {subdivisions.map((subdivision) => (
                                <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shipping Options</InputLabel>
                        <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                            {options.map((option) => (
                                <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <br />
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <Button component={Link} to='/cart' variant="outlined">Back to Cart</Button>
                    <Button type="submit" variant="contained">Next</Button>
                </div>
            </form>
        </FormProvider>
    </>
  )
}

export default AddressForm