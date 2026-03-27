---
State_ID: BigInt(0x0)
Git_SHA: LATEST
Grammar_Lock: "@root/hashes/grammar/typescript.hash.md"
---

## @UI.Profile.SidebarProfile

### [Component]
| File | Role |
|------|------|
| `SidebarProfile.tsx` | Main user profile entry in the sidebar, providing sign-out, help, and user info displays within a popover interface. |

### [Governance]
- **Auth_Law**: Protected component, strictly depends on `useAuth()`.
- **I18n_Law**: All text strings resolved via `useI18n()`.
- **Animation_Law**: Uses Framer Motion for popover enter/exit transitions (`menuVariants`, `tabVariants`).

### [Linkage]
- **Upstream**: `contexts/AuthContext`, framer-motion, lucide-react.
- **Downstream**: Rendered by `ChatSidebar` or `SideNav`.
