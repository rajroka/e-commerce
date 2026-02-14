import { createAuthClient } from 'better-auth/react'
import { auth } from './auth';


export const { signIn, signUp, signOut, useSession } = createAuthClient( {

  
})

// export const { signIn, signUp, signOut, useSession } = createAuthClient({
//   auth, // <- important
// });
