import { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { ShopLayout } from 'components';
import { countries } from 'utils';
import { IAddress } from 'interfaces';
import { useCartContext } from 'context';

const getAddressFromCookies = (): IAddress => {
  const addressCookie = Cookies.get('address');
  const address = addressCookie ? JSON.parse(addressCookie) : null;

  return {
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    address: address?.address || '',
    address2: address?.address2 || '',
    postalCode: address?.postalCode || '',
    city: address?.city || '',
    country: address?.country || 'ARG',
    phone: address?.phone || '',
  };
};

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { updateAddress } = useCartContext();
  const [countrySelected, setCountrySelected] = useState('ARG');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IAddress>({
    defaultValues: getAddressFromCookies(),
  });

  useEffect(() => {
    const { country } = getAddressFromCookies();
    setCountrySelected(country);
  }, []);

  const onSubmitAddress = (data: IAddress) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  const onCountryChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue('country', e.target.value);
    setCountrySelected(e.target.value);
  };

  return (
    <ShopLayout title="Dirección" pageDescription="Confirmar dirección del destino">
      <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
        <Typography variant="h1" component="h1">
          Dirección
        </Typography>

        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              {...register('firstName', {
                required: 'El nombre es requerido',
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              {...register('lastName', {
                required: 'El apellido es requerido',
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              error={!!errors.address}
              helperText={errors.address?.message}
              {...register('address', {
                required: 'La dirección es requerida',
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 (opcional)"
              variant="filled"
              fullWidth
              error={!!errors.address2}
              helperText={errors.address2?.message}
              {...register('address2')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              variant="filled"
              fullWidth
              error={!!errors.postalCode}
              helperText={errors.postalCode?.message}
              {...register('postalCode', {
                required: 'El código postal es requerido',
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              error={!!errors.city}
              helperText={errors.city?.message}
              {...register('city', {
                required: 'La ciudad es requerida',
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="País"
              variant="filled"
              error={!!errors.country}
              helperText={errors.country?.message}
              select
              fullWidth
              value={countrySelected}
              onChange={onCountryChange}>
              {countries.map(({ code, name }) => (
                <MenuItem key={code} value={code}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
              {...register('phone', {
                required: 'El teléfono es requerido',
              })}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" color="secondary" className="circular-btn" size="large">
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

export default AddressPage;
