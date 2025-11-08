import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth/next-auth-options";
import { logInfo } from "@/lib/logging/console";

logInfo({
  scope: "api:nextauth",
  event: "init",
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


