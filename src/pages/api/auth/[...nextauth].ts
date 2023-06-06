import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from 'database';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials) {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
  session: {
    maxAge: 2592000, /// 30 dias
    strategy: 'jwt',
    updateAge: 86400, /// cada día
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'credentials':
            token.user = user;
            break;
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
            break;
          default:
            break;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;
      return session;
    },
  },
};

export default NextAuth(authOptions);
