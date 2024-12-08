import { SvelteKitAuth } from "@auth/sveltekit"
import Credentials from "@auth/sveltekit/providers/credentials"
 
export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ request }) {
        const response = await fetch(request)
        if (!response.ok) return null
        return (await response.json()) ?? null
      },
    }),
  ],
})