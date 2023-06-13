import Link from 'next/link';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useUIContext } from 'context';

const AdminNavbar = () => {
  const { toggleMenu } = useUIContext();

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
        <Button onClick={toggleMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
