import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/config"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Only include OAuth providers if credentials are properly configured
    ...(auth.providers.google.enabled ? [
      GoogleProvider({
        clientId: auth.providers.google.clientId,
        clientSecret: auth.providers.google.clientSecret,
      })
    ] : []),

    ...(auth.providers.github.enabled ? [
      GitHubProvider({
        clientId: auth.providers.github.clientId,
        clientSecret: auth.providers.github.clientSecret,
      })
    ] : []),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // For credentials provider, we'll need to add a password field to the User model
        // and handle password hashing. For now, this is a placeholder.
        // In a real app, you'd compare the hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password || ""
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET || auth.secret,
}
