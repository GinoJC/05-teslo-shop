import { FC } from 'react';
import Link from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { ItemCounter } from 'components/ui';
import { useCartContext } from 'context';
import { ICartProduct, IOrderItem } from 'interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateProductQuantity, removeCartProduct } = useCartContext();

  const onUpdateQuantity = (product: ICartProduct, newQuantity: number) => {
    product.quantity = newQuantity;
    updateProductQuantity(product);
  };

  const productsToShow = products || cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid container spacing={2} mb={1} key={`${product.slug}-${product.size}`}>
          <Grid item xs={3}>
            <Link href={`/product/${product.slug}`}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`/products/${product.image}`}
                  sx={{ borderRadius: '5px' }}
                />
              </CardActionArea>
            </Link>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
              </Typography>
              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  updatedQuantity={(newQuantity) => onUpdateQuantity(product, newQuantity)}
                  maxValue={10}
                />
              ) : (
                <Typography variant="h5">
                  {product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2} display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle1">${product.price}</Typography>
            {editable && (
              <Button variant="text" color="secondary" onClick={() => removeCartProduct(product)}>
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default CartList;
