import Link from 'next/link';
import { AppBar, Badge, Box, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar>
      <Toolbar>
        <Link
          href="/"
          passHref
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#000' }}>
          <Typography variant="h6">Teslo |</Typography>
          <Typography sx={{ ml: 0.5 }}>Shop</Typography>
        </Link>
        <Box flex={1} />
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Link href="/category/men" passHref>
            <Button>Hombres</Button>
          </Link>
          <Link href="/category/women" passHref>
            <Button>Mujeres</Button>
          </Link>
          <Link href="/category/kid" passHref>
            <Button>Niños</Button>
          </Link>
        </Box>
        <Box flex={1} />
        <IconButton>
          <SearchOutlined />
        </IconButton>
        <Link href="/cart" passHref>
          <IconButton>
            <Badge badgeContent={2} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </Link>
        <Button>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
