import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({ name, label, required }) => {
    const { control } = useFormContext();
    const isError = false;

  return (
    <Grid item xs={12} sm={6}>
      <Controller
        name={name}
        control={control}
        render={() => (
          <TextField label={label} name={name} required={required} />
        )}
        fullWidth
        label={label}
      />
    </Grid>
  )
}

export default FormInput