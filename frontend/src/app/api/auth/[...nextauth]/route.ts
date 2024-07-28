import NextAuth, { NextAuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

interface CustomUser {
  id: string;
  email: string;
  token: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      token: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    token: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        try {
          const response = await axios.post('http://localhost:3001/login', credentials, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (response.status === 200) {
            const user: CustomUser = response.data;
            console.log('Authorize - User:', user);
            return user;
          }
        } catch (error) {
          console.error('Authorization error:', error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = (user as CustomUser).id;
        token.email = (user as CustomUser).email;
        token.token = (user as CustomUser).token;
        console.log('JWT Callback - Token:', token);
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
        id: token.id as string,
        email: token.email as string,
        token: token.token as string,
      };
      console.log('Session Callback - Session:', session);
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.JWT_SECRET || 'supersecret',
};


const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions);

export { handler as GET, handler as POST };
