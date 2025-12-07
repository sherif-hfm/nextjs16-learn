import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;      
      provider?: string;
      id_token?: string;
      access_token?: string;
      // Keycloak claims
      DateOfBirth?: string | null;
      IdentityType?: string | null;
      DirCode?: string | null;
      FamilyName?: string;
      DirDesc?: string;
      UserCode?: string;
      DateOfBirthHJ?: string;
      DateOfBirthHJ?: string;
      MobileNumber?: string;
      FullName?: string;
      ThirdName?: string;
      UserType?: string;
      IdentityNo?: string;
      FatherName?: string;
      role?: string[];      
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
    DateOfBirth?: string | null;
    IdentityType?: string | null;
    DirCode?: string | null;
    FamilyName?: string;
    DirDesc?: string;
    UserCode?: string;
    DateOfBirthHJ?: string;
    DateOfBirthHJ?: string;
    MobileNumber?: string;
    FullName?: string;
    ThirdName?: string;
    UserType?: string;
    IdentityNo?: string;
    FatherName?: string;
    role?: string[];
    error?: string;
  }
}
