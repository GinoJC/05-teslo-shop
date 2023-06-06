import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  AccountCircleOutlined,
  AdminPanelSettings,
  CategoryOutlined,
  ConfirmationNumberOutlined,
  EscalatorWarningOutlined,
  FemaleOutlined,
  LoginOutlined,
  MaleOutlined,
  SearchOutlined,
  VpnKeyOutlined,
} from '@mui/icons-material';
import { useAuthContext, useUIContext } from 'context';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SideMenu = () => {
  const router = useRouter();
  const { menuOpen, toggleMenu } = useUIContext();
  const { user, logoutUser } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');

  const navigateTo = (url: string) => {
    router.push(url);
    toggleMenu();
  };

  const onSearch = () => {
    if (searchTerm.trim().length === 0) return;
    navigateTo(`/search/${searchTerm}`);
  };

  return (
    <Drawer
      open={menuOpen}
      anchor="right"
      onClose={toggleMenu}
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}>
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              autoFocus
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => (e.key === 'Enter' ? onSearch() : null)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={onSearch}>
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>
          <ListSubheader sx={{ display: { xs: '', sm: 'none' } }}>Categorías</ListSubheader>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/men')}>
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/women')}>
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => navigateTo('/category/kid')}>
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItemButton>

          <Divider sx={{ display: { xs: '', sm: 'none' } }} />
          {user ? (
            <>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary={'Perfil'} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Mis Ordenes'} />
              </ListItemButton>
              <ListItemButton onClick={logoutUser}>
                <ListItemIcon>
                  <LoginOutlined />
                </ListItemIcon>
                <ListItemText primary={'Salir'} />
              </ListItemButton>
            </>
          ) : (
            <ListItemButton onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
              <ListItemIcon>
                <VpnKeyOutlined />
              </ListItemIcon>
              <ListItemText primary={'Ingresar'} />
            </ListItemButton>
          )}

          {user?.role === 'admin' && (
            <>
              <Divider />
              <ListSubheader>Admin Panel</ListSubheader>
              <ListItemButton>
                <ListItemIcon>
                  <CategoryOutlined />
                </ListItemIcon>
                <ListItemText primary={'Productos'} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
