import { FC, PropsWithChildren, useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthContext, authReducer } from '.';
import { IUser } from 'interfaces';
import { tesloApi } from 'api';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

export const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { data, status } = useSession();
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  useEffect(() => {
    if (status === 'authenticated') dispatch({ type: 'LOGIN', payload: data.user as IUser });
  }, [status, data]);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/users/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post('/users/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: 'LOGIN', payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo',
      };
    }
  };

  const logoutUser = () => {
    Cookies.remove('cart');
    Cookies.remove('address');
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        logoutUser,
        registerUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within a AuthProvider');
  return context;
}
