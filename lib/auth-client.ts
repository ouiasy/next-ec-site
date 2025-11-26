import { createAuthClient} from "better-auth/react";
import {SERVER_URL} from "@/lib/constants";
import {adminClient} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: SERVER_URL,
  plugins: [
      adminClient(),
  ]
})