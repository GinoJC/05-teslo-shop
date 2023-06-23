import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthLayout } from 'components';
import { validations } from 'utils';

type FormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    getProviders().then((prov) => setProviders(prov));
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    const isValidLogin = await signIn('credentials', { email, password, redirect: false });
    if (!isValidLogin?.ok) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else {
      const destination = router.query.p?.toString() || '/';
      router.replace(destination);
    }
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, p: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              <Chip
                label="No reconocemos ese usuario / contraseña"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Este campo es requerido',
                  validate: validations.isEmail,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                variant="filled"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Este campo es requerido',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth>
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <Link
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p?.toString()}`
                    : '/auth/register'
                }
                style={{ color: 'black' }}>
                ¿No tienes cuenta?
              </Link>
            </Grid>
            <Grid item xs={12} display="flex" flexDirection="column" justifyContent="end">
              <Divider sx={{ width: '100%', mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === 'credentials') return null;
                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}>
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  if (session) {
    const { p = '/' } = query;
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
