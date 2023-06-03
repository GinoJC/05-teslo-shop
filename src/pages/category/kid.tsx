import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { FullScreenLoading, ShopLayout, ProductList } from 'components';
import { useProducts } from 'hooks';

const KidPage: NextPage = () => {
  const { data, isLoading } = useProducts('products?gender=kid');

  return (
    <ShopLayout
      title="Teslo-Shop - Kid"
      pageDescription="Encuentra los mejores productos para ellos">
      <Typography variant="h1" component="h1">
        Niños
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={data} />}
    </ShopLayout>
  );
};

export default KidPage;
