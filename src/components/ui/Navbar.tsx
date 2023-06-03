import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Toolbar,
  Typography,
} from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useCartContext, useUIContext } from 'context';

const Navbar = () => {
  const { asPath, push } = useRouter();
  const { toggleMenu } = useUIContext();
  const { numberOfItems } = useCartContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearch = () => {
    if (searchTerm.trim().length === 0) return;
    push(`/search/${searchTerm}`);
  };

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
            <Button color={asPath === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
          </Link>
          <Link href="/category/women" passHref>
            <Button color={asPath === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
          </Link>
          <Link href="/category/kid" passHref>
            <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
          </Link>
        </Box>
        <Box flex={1} />
        {isSearchVisible ? (
          <Input
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            autoFocus
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={(e) => (e.key === 'Enter' ? onSearch() : null)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => setIsSearchVisible(false)}>
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            onClick={() => setIsSearchVisible(true)}
            className="fadein"
            sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <SearchOutlined />
          </IconButton>
        )}

        <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleMenu}>
          <SearchOutlined />
        </IconButton>
        <Link href="/cart" passHref>
          <IconButton>
            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color="secondary">
              <ShoppingCartOutlined />
            </Badge>
          </IconButton>
        </Link>
        <Button onClick={toggleMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
