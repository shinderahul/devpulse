import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: 'read:user user:email' },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.login       = (profile as { login?: string }).login
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.user.name        = token.login as string
      session.user.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/',
    error:  '/',
  },
})