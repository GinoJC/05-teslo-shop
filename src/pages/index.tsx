import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { FullScreenLoading, ShopLayout, ProductList } from 'components';
import { useProducts } from 'hooks';

const HomePage: NextPage = () => {
  const { data, isLoading } = useProducts('products');

  return (
    <ShopLayout
      title="Teslo-Shop - Home"
      pageDescription="Encuentra los mejores productos de Teslo aquí">
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={data} />}
    </ShopLayout>
  );
};

export default HomePage;
