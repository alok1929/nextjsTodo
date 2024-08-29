import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: "921073390661-jmsm8r7p4oe00kgniutn5e36fscilvos.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};