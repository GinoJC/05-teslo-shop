import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { FullScreenLoading, ShopLayout, ProductList } from 'components';
import { useProducts } from 'hooks';

const MenPage: NextPage = () => {
  const { data, isLoading } = useProducts('products?gender=men');

  return (
    <ShopLayout
      title="Teslo-Shop - Men"
      pageDescription="Encuentra los mejores productos para ellos">
      <Typography variant="h1" component="h1">
        Hombres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para hombres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={data} />}
    </ShopLayout>
  );
};

export default MenPage;
