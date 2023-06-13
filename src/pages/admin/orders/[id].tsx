import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import {
  ConfirmationNumberOutlined,
  CreditCardOutlined,
  CreditScoreOutlined,
} from '@mui/icons-material';
import { AdminLayout, CartList, OrderSummary } from 'components';
import { dbOrders } from 'database';
import { IOrder } from 'interfaces';
import { countries } from 'utils';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;
  const { firstName, lastName, address, address2, city, postalCode, phone } = shippingAddress;
  const country = countries.find(({ code }) => code === shippingAddress?.country)?.name;

  return (
    <AdminLayout
      title="Resumen de la orden"
      subtitle={`Orden ${_id}`}
      icon={<ConfirmationNumberOutlined />}>
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOutlined />}
        />
      )}
      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
              </Box>
              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address} {address2 ?? `, ${address2}`}
              </Typography>
              <Typography>
                {city}, {postalCode}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary orderValues={{ numberOfItems, subTotal, tax, total }} />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label="Orden pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <Chip
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant="outlined"
                    color="error"
                    icon={<CreditScoreOutlined />}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
        permanent: false,
      },
    };
  }
  return {
    props: { order },
  };
};

export default OrderPage;
