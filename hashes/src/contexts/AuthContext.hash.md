---
State_ID: BigInt(0x0fc98cc)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @Context.AuthContext

### [Signatures]
```ts
export interface UserProfile { display_name: string | null; bio: string | null; language: string | null; avatar_url: string | null; preferences: Json | null; }
export interface AuthContextType { user: User | null; profile: UserProfile | null; session: Session | null; isAuthenticated: boolean; isLoading: boolean; signIn: (redirectUrl?: string) => Promise<void>; signOut: () => Promise<void>; refreshProfile: () => Promise<void>; }

export const AuthContext: React.Context<AuthContextType | undefined>
export function AuthProvider(props: { children: ReactNode }): JSX.Element
export function useAuth(): AuthContextType
```

### [Governance]
- **State_Silo_Law:** Primary source of truth for global authentication. Obsoletes Redux `authSlice`.
- **Session_Refresh_Law:** Utilizes Supabase `onAuthStateChange` listener to hydrate local context.
- **Provider_Boundary:** Wraps the core React tree.

### [Semantic Hash]
Provides global `<AuthContext.Provider>` for Supabase Google OAuth and User Profile syncing logic across the application.

### [Linkage]
- **Dependencies:** `@supabase/ssr`, `lucide-react`, `React.createContext`, `Database` (types)
