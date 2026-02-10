import NextAuth from 'next-auth';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';

export const {handlers, auth, signIn, signOut} = NextAuth({
  session: {strategy: 'jwt'},
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET
    })
  ],
  callbacks: {
    async signIn({user, account}) {
      if (account?.provider !== 'google' && account?.provider !== 'facebook') {
        return true;
      }

      const apiBase = process.env.BACKEND_API;
      if (!apiBase) {
        return true;
      }

      const externalToken = account.id_token ?? account.access_token;

      try {
        const response = await fetch(`${apiBase}/api/auth/external-verify`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            token: externalToken,
            provider: account.provider,
            email: user.email
          })
        });

        if (!response.ok) {
          return false;
        }

        const data = (await response.json()) as {apiToken?: string; role?: string};

        if (!data.apiToken) {
          return false;
        }

        (user as typeof user & {backendToken?: string; role?: string}).backendToken = data.apiToken;
        (user as typeof user & {backendToken?: string; role?: string}).role = data.role ?? 'user';

        return true;
      } catch {
        return false;
      }
    },
    async jwt({token, user}) {
      if (user) {
        token.backendToken = (user as {backendToken?: string}).backendToken;
        token.role = (user as {role?: string}).role;
      }
      return token;
    },
    async session({session, token}) {
      if (session.user) {
        session.user.backendToken = token.backendToken as string | undefined;
        session.user.role = token.role as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: '/zh/login'
  }
});
