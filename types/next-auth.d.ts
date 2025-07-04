import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      userType: string;
    };
  }

  interface User {
    userType: string;
  }
}
