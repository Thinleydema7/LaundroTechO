import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter your email and password');
          }

          await connectDB();
          console.log('Looking for user with email:', credentials.email);

          const user = await User.findOne({ email: credentials.email.toLowerCase() });

          if (!user) {
            console.log('No user found with email:', credentials.email);
            throw new Error('No user found with this email');
          }

          console.log('Comparing passwords...');
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('Invalid password for user:', credentials.email);
            throw new Error('Invalid password');
          }

          console.log('User authenticated successfully:', user.email);
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            address: user.address || ''
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone || '';
        token.address = user.address || '';
      }
      
      // Handle updates to the session
      if (trigger === 'update' && session) {
        console.log('JWT callback - Updating token with session:', session);
        token.name = session.user.name;
        token.phone = session.user.phone || '';
        token.address = session.user.address || '';
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session callback - Updating session with token:', token);
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone || '';
        session.user.address = token.address || '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret-here',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
