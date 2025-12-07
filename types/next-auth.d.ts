import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
      id_token?: string;
      access_token?: string;
      // Keycloak claims
      FullName?: string;
      MobileNumber?: string;
      role?: string[];
      IdentityNo?: string;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    provider?: string;
    id_token?: string;
    access_token?: string;
    // Keycloak claims
    FullName?: string;
    MobileNumber?: string;
    role?: string[];
    IdentityNo?: string;
  }
}
