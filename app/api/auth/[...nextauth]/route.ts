import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";
import type { NextAuthOptions } from "next-auth";
import { decodeJwt } from "jose";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Static credentials check
        if (credentials?.username === "admin" && credentials?.password === "123") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.provider = account.provider;
        token.id_token = account.id_token;
        token.access_token = account.access_token;
        
        // Decode Keycloak ID token to extract custom claims
        if (account.provider === "keycloak" && account.id_token) {
          try {
            const decodedToken = decodeJwt(account.id_token);
            
            // Extract Keycloak claims - prioritize exact claim names, then try variations
            token.FullName = (decodedToken.FullName as string) || 
                             (decodedToken.fullName as string) || 
                             (decodedToken.full_name as string) ||
                             (decodedToken.name as string) ||
                             undefined;
            
            token.MobileNumber = (decodedToken.MobileNumber as string) || 
                                 (decodedToken.mobileNumber as string) || 
                                 (decodedToken.mobile_number as string) ||
                                 (decodedToken.phone_number as string) ||
                                 undefined;
            
            token.IdentityNo = (decodedToken.IdentityNo as string) || 
                               (decodedToken.identityNo as string) || 
                               (decodedToken.identity_no as string) ||
                               undefined;
            
            // Handle roles - check for 'role' array first, then Keycloak standard formats
            if (decodedToken.role) {
              token.role = Array.isArray(decodedToken.role) 
                ? decodedToken.role as string[]
                : [decodedToken.role as string];
            } else if (decodedToken.roles) {
              token.role = Array.isArray(decodedToken.roles)
                ? decodedToken.roles as string[]
                : [decodedToken.roles as string];
            } else if (decodedToken.realm_access?.roles) {
              token.role = decodedToken.realm_access.roles as string[];
            } else if (decodedToken.resource_access) {
              // Check for client-specific roles
              const clientRoles = Object.values(decodedToken.resource_access)
                .flatMap((access: any) => access?.roles || []);
              token.role = clientRoles.length > 0 ? clientRoles : undefined;
            }
          } catch (error) {
            console.error("Error decoding Keycloak token:", error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
        session.user.id_token = token.id_token as string;
        session.user.access_token = token.access_token as string;
        
        // Add Keycloak claims to session
        if (token.provider === "keycloak") {
          session.user.FullName = token.FullName;
          session.user.MobileNumber = token.MobileNumber;
          session.user.role = token.role;
          session.user.IdentityNo = token.IdentityNo;
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
