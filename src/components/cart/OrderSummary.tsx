import { FC } from 'react';
import { Grid, Typography } from '@mui/material';
import { useCartContext } from 'context';
import { currency } from 'utils';

const OrderSummary: FC = () => {
  const { numberOfItems, subTotal, tax, total } = useCartContext();
  const taxPercent = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0) * 100;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>
          {numberOfItems} {numberOfItems > 1 ? 'items' : 'item'}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Sub Total</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos ({taxPercent}%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end">
        <Typography>{currency.format(tax)}</Typography>
      </Grid>
      <Grid item xs={6} mt={2}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="end" mt={2}>
        <Typography variant="subtitle1">{currency.format(total)}</Typography>
      </Grid>
    </Grid>
  );
};

export default OrderSummary;
