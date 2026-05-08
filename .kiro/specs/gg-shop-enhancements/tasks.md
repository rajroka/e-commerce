# Implementation Plan: GG Shop Enhancements

## Overview

Implement ten cross-cutting enhancements to the GG Shop Next.js application in a logical dependency order: infrastructure first (image config, toast consolidation), then security (middleware, RBAC), then data layer (Cart model + API), then client sync (CartStore), then UX features (error boundaries, pagination), then metadata and accessibility, and finally static content pages. Property-based tests using fast-check are woven in close to each implementation task.

## Tasks

- [ ] 1. Image optimization configuration
  - [ ] 1.1 Migrate `next.config.ts` from `images.domains` to `images.remotePatterns`
    - Replace the `domains` array with a `remotePatterns` array containing entries for `res.cloudinary.com`, `lh3.googleusercontent.com`, `fakestoreapi.com`, and `unsplash.com`, each with `protocol: 'https'`
    - Remove the old `domains` key entirely
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 2. Toast library consolidation
  - [ ] 2.1 Replace `react-toastify` with `react-hot-toast` in `app/(dashboard)/edit-product/[productId]/page.tsx`
    - Remove `import { toast, ToastContainer } from 'react-toastify'` and `import 'react-toastify/dist/ReactToastify.css'`
    - Add `import toast from 'react-hot-toast'`
    - Remove the `<ToastContainer>` JSX element (global `Toaster` is already in `app/layout.tsx`)
    - _Requirements: 7.1, 7.2, 7.4, 7.5_
  - [ ] 2.2 Replace `react-toastify` with `react-hot-toast` in `app/(dashboard)/dashboard/page.tsx`
    - Remove `import { toast, ToastContainer } from 'react-toastify'` and the CSS import
    - Add `import toast from 'react-hot-toast'`
    - Remove the `<ToastContainer>` JSX element
    - _Requirements: 7.1, 7.2, 7.4, 7.5_
  - [ ] 2.3 Remove `react-toastify` from `package.json`
    - Delete the `react-toastify` entry from `dependencies`
    - _Requirements: 7.3_

- [ ] 3. Middleware-based route protection
  - [ ] 3.1 Create `middleware.ts` at the project root replacing `proxy.ts`
    - Define `PROTECTED_PATHS = ['/dashboard', '/add-product', '/all-products', '/edit-product']`
    - Call `auth.api.getSession({ headers: request.headers })` — not cookie inspection
    - Redirect to `/sign-in` when no session; redirect to `/` when `session.user.role !== 'admin'`; call `NextResponse.next()` for admins
    - Wrap `auth.api.getSession` in try/catch and redirect to `/sign-in` on error
    - Export `config.matcher` covering all four protected path patterns including `/edit-product/:path*`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 3.2 Write property tests for middleware route protection (Properties 1, 2, 3)
    - **Property 1: Middleware blocks unauthenticated access to all dashboard routes**
    - **Property 2: Middleware blocks regular-user access to all dashboard routes**
    - **Property 3: Middleware passes admin access to all dashboard routes**
    - Use `fc.constantFrom(...PROTECTED_PATHS)` with `fc.string()` for sub-paths; mock `auth.api.getSession` to return `null`, user-role session, or admin-role session
    - **Validates: Requirements 1.4, 1.5, 2.1, 2.2, 2.3, 2.4**

- [ ] 4. Role-based access control — Nav and dashboard layout
  - [ ] 4.1 Add conditional Dashboard link to `components/Nav.tsx`
    - Read `session?.user?.role` from `useSession()`
    - Render `<Link href="/dashboard">Dashboard</Link>` only when `role === 'admin'`, in both desktop nav and mobile drawer
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ] 4.2 Convert `app/(dashboard)/layout.tsx` to an async Server Component with server-side role check
    - Import `auth` from `@/lib/auth` and `headers` from `next/headers`
    - Call `auth.api.getSession({ headers: await headers() })`
    - Call `redirect('/')` if no session or `role !== 'admin'`
    - Keep existing `<Sidebar>` and `<Navbar>` layout structure
    - _Requirements: 1.6_

- [ ] 5. Cart Mongoose model
  - [ ] 5.1 Create `lib/modals/Cart.ts` with the Cart schema
    - Define `cartItemSchema` with fields: `id` (String), `name` (String), `image` (String), `price` (Number), `quantity` (Number, min: 1); set `{ _id: false }`
    - Define `cartSchema` with `userId` (String, required, unique, indexed) and `items` ([cartItemSchema], default: []), with `{ timestamps: true }`
    - Export `Cart = models.Cart || model('Cart', cartSchema)`
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 6. Cart API routes
  - [ ] 6.1 Create `app/api/cart/route.ts` with GET, POST, and DELETE handlers
    - All handlers call `auth.api.getSession({ headers: request.headers })` and return `401` if no session
    - `GET`: find cart by `userId`, return `{ items: [] }` if not found, else `{ items: cart.items }`
    - `POST`: parse `{ items }` from request body; upsert cart document using `findOneAndUpdate` with `{ upsert: true, new: true }`; return `{ ok: true }`
    - `DELETE`: delete cart document by `userId`; return `{ ok: true }`
    - _Requirements: 3.1, 3.2, 3.3_
  - [ ]* 6.2 Write property tests for Cart API round-trip (Properties 4, 5)
    - **Property 4: Cart GET/POST round-trip preserves items**
    - **Property 5: Cart DELETE clears all items**
    - Use `fc.array(fc.record({ id: fc.uuid(), name: fc.string({ minLength: 1 }), image: fc.webUrl(), price: fc.float({ min: 0.01, max: 9999 }), quantity: fc.integer({ min: 1, max: 99 }) }))` for item generation
    - Use `mongodb-memory-server` for in-memory DB isolation
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [ ] 7. CartStore server sync extension
  - [ ] 7.1 Extend `store/cartStore.ts` with server sync actions
    - Add `syncStatus: 'idle' | 'syncing' | 'error'` field to state
    - Add `syncWithServer()`: fetch `GET /api/cart`, hydrate `items` from response; on 401 clear items and show toast "Cart sync failed. Please sign in again."
    - Add `pushToServer()`: if `userId` is null return immediately; fetch `POST /api/cart` with current items; debounce 400ms using a module-level timer ref
    - Add `clearFromServer()`: if `userId` is null return immediately; fetch `DELETE /api/cart`
    - Update `setUserId`: when `status` transitions to `'authenticated'`, call `syncWithServer()`
    - Update `addToCart`, `removeFromCart`, `decreaseQuantity`, `clearCart`: after state update, schedule `pushToServer()` via the debounce ref
    - Update `clearCart` (sign-out path): also call `clearFromServer()`
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_
  - [ ]* 7.2 Write property tests for CartStore sync behavior (Properties 6, 7)
    - **Property 6: Authenticated cart mutations always trigger server sync within 500ms**
    - **Property 7: Unauthenticated cart mutations never trigger server sync**
    - Use `fc.oneof(fc.constant('add'), fc.constant('remove'), fc.constant('decrease'), fc.constant('clear'))` for mutation type; mock `fetch`; assert POST called / not called
    - **Validates: Requirements 3.5, 3.8**

- [ ] 8. Checkpoint — Core infrastructure complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. React Error Boundaries
  - [ ] 9.1 Create `components/ProductErrorBoundary.tsx` as a React class component
    - Implement `getDerivedStateFromError` to set `{ hasError: true, error }`
    - Implement `componentDidCatch` to call `console.error(error, info)`
    - Render `props.children` when no error; render fallback UI (or `props.fallback`) when error is caught
    - Default fallback: centered card on `#F9F4F5` background with message "Some products could not be loaded. Please try refreshing the page."
    - Accept optional `fallback?: React.ReactNode` prop
    - _Requirements: 5.1, 5.2, 5.3, 5.6_
  - [ ] 9.2 Wrap product sections with `ProductErrorBoundary`
    - In `app/(page)/products/page.tsx`: wrap `<ProductList>` with `<ProductErrorBoundary>`
    - In `app/(page)/products/[productId]/page.tsx`: wrap `<ProductDetailsClient>` with `<ProductErrorBoundary>`
    - _Requirements: 5.4, 5.5_

- [ ] 10. Pagination — API layer
  - [ ] 10.1 Update `GET /api/products` handler in `app/api/products/route.ts` to support pagination
    - Parse `page` (default 1) and `limit` (default 12) from query params using `parseInt`, defaulting to 1/12 on `NaN`; clamp `limit` to 1–100
    - Run `Product.find(filter).skip((page-1)*limit).limit(limit)` and `Product.countDocuments(filter)` in parallel with `Promise.all`
    - Return `{ products, totalCount, page, totalPages: Math.ceil(totalCount / limit) }` instead of the raw array
    - _Requirements: 6.1, 6.2_
  - [ ]* 10.2 Write property tests for paginated API response shape (Property 8)
    - **Property 8: Paginated API response always contains required fields with correct semantics**
    - Use `fc.integer({ min: 1, max: 20 })` for page and `fc.integer({ min: 1, max: 100 })` for limit; seed DB with a fixed product set; assert `products.length <= limit`, `page` equals requested page, `totalPages === Math.ceil(totalCount / limit)`
    - **Validates: Requirements 6.1, 6.2**

- [ ] 11. Pagination — UI layer
  - [ ] 11.1 Create `components/Pagination.tsx` client component
    - Accept `{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }` props
    - Render Previous button, page number buttons (with ellipsis for ranges > 7 pages), and Next button
    - Add `aria-label="Go to page N"` on each page button and `aria-current="page"` on the active page button
    - Disable Previous on page 1 and Next on the last page
    - _Requirements: 6.4, 6.7_
  - [ ] 11.2 Integrate pagination into `app/(page)/products/page.tsx` and `components/Productlist.tsx`
    - Update `fetchProducts` in `lib/fetchproducts.ts` (or call the API route directly) to accept `page` and `limit` and return the `PaginatedProductsResponse` shape
    - Update `app/(page)/products/page.tsx` to read `searchParams.page`, fetch paginated data, and pass `totalPages` + `currentPage` to `<Pagination>`
    - Wire `onPageChange` to `router.push('?page=N')` and `window.scrollTo(0, 0)`
    - Show `<Pagination>` only when `totalCount > 12`
    - _Requirements: 6.3, 6.4, 6.5, 6.6_
  - [ ]* 11.3 Write property tests for Pagination component visibility (Property 9)
    - **Property 9: Pagination controls visibility matches product count**
    - Use `fc.integer({ min: 0, max: 1000 })` for totalCount; render `<Pagination>` with derived props; assert controls present iff `totalCount > 12`
    - **Validates: Requirements 6.6**

- [ ] 12. SEO metadata
  - [ ] 12.1 Add static `metadata` export to `app/(page)/products/page.tsx`
    - Export `export const metadata: Metadata = { title: 'Shop All Products — GG Shop', description: 'Browse our full collection of premium cosmetics — lips, face, and skincare. Consciously crafted in Pokhara.' }`
    - _Requirements: 8.1_
  - [ ] 12.2 Add `generateMetadata` to `app/(page)/products/[productId]/page.tsx`
    - Export `async function generateMetadata({ params })` that calls `fetchProductById`
    - Return `{ title: \`${product.name} — GG Shop\`, description: product.description, openGraph: { images: [{ url: product.image }] } }`
    - Catch errors and return fallback `{ title: 'Product — GG Shop', description: 'View product details at GG Shop.' }`
    - _Requirements: 8.2, 8.3, 8.4_
  - [ ]* 12.3 Write property tests for `generateMetadata` completeness (Property 10)
    - **Property 10: generateMetadata always returns all required fields for any product**
    - Use `fc.record({ name: fc.string({ minLength: 1 }), description: fc.string(), image: fc.webUrl() })`; mock `fetchProductById`; assert `title` contains product name, `description` matches, `openGraph.images[0].url` matches
    - **Validates: Requirements 8.2, 8.3**

- [ ] 13. Form accessibility — label elements
  - [ ] 13.1 Add `<label>` elements to `app/(page)/(auth)/sign-in/page.tsx`
    - Add `id="email"` to the email input and `id="password"` to the password input
    - Insert `<label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>` above each input
    - Insert `<label htmlFor="password" ...>Password</label>` above the password input
    - Preserve all existing placeholder attributes
    - _Requirements: 9.1, 9.3, 9.4, 9.5_
  - [ ] 13.2 Add `<label>` elements to `app/(page)/(auth)/sign-up/page.tsx`
    - Add `id="name"`, `id="email"`, `id="password"` to the respective inputs
    - Insert matching `<label>` elements with `htmlFor` attributes above each input, styled to match the design language
    - Preserve all existing placeholder attributes
    - _Requirements: 9.2, 9.3, 9.4, 9.5_
  - [ ]* 13.3 Write property tests for form label association (Property 11)
    - **Property 11: Auth form inputs always have associated label elements**
    - Use `fc.boolean()` to vary loading/error states; render sign-in and sign-up forms with `@testing-library/react`; assert each input has a `<label>` whose `htmlFor` matches the input's `id`
    - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ] 14. Checkpoint — Features complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Static informational pages
  - [ ] 15.1 Create `app/(page)/contact/page.tsx`
    - Export `metadata` with `title: 'Contact Us — GG Shop'` and a description
    - Render a contact form with name, email, and message fields (client component or server component with a Server Action)
    - Include store address and email information (Lakeside, Pokhara, Nepal / support@ggcosmetics.com)
    - _Requirements: 10.1, 10.6, 10.8_
  - [ ] 15.2 Create `app/(page)/shipping/page.tsx`
    - Export `metadata` with `title: 'Shipping & Returns — GG Shop'`
    - Render shipping policy content: estimated delivery times, return policy details
    - _Requirements: 10.2, 10.6, 10.8_
  - [ ] 15.3 Create `app/(page)/faq/page.tsx`
    - Export `metadata` with `title: 'FAQ — GG Shop'`
    - Render at least five Q&A items in an accordion or list format using `<details>`/`<summary>` or a styled list
    - _Requirements: 10.3, 10.6, 10.8_
  - [ ] 15.4 Create `app/(page)/privacy/page.tsx`
    - Export `metadata` with `title: 'Privacy Policy — GG Shop'`
    - Render privacy policy covering data collection, usage, and user rights
    - _Requirements: 10.4, 10.6, 10.8_
  - [ ] 15.5 Create `app/(page)/terms/page.tsx`
    - Export `metadata` with `title: 'Terms of Service — GG Shop'`
    - Render terms of service covering purchase terms, refund policy, and acceptable use
    - _Requirements: 10.5, 10.6, 10.8_
  - [ ] 15.6 Update `components/Footer.tsx` to ensure all five static page links are correct
    - Verify `/contact`, `/shipping`, `/faq`, `/privacy`, `/terms` hrefs are present and accurate in the Support section and bottom bar
    - The Footer already has most links; update any that point to wrong routes (e.g., `/faq` currently links to "Order Tracking" — update label to "FAQ")
    - _Requirements: 10.7_
  - [ ]* 15.7 Write property tests for Footer static page links (Property 12)
    - **Property 12: Footer always links to all five static pages**
    - Render `<Footer>` with `@testing-library/react`; assert all five hrefs (`/contact`, `/shipping`, `/faq`, `/privacy`, `/terms`) are present as anchor elements
    - **Validates: Requirements 10.7**

- [ ] 16. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Property-based tests use **fast-check** (`npm install --save-dev fast-check`); run with Vitest or Jest
- Cart API property tests (6.2) require `mongodb-memory-server` for in-memory DB isolation
- Form accessibility tests (13.3) require `@testing-library/react`
- Each property test explicitly references its property number from the design document
- The `react-toastify` package removal (task 2.3) should be done after all import replacements are verified
- `middleware.ts` at the project root replaces the existing `proxy.ts` stub — `proxy.ts` can be deleted after 3.1 is complete
- The `fetchProducts` function in `lib/fetchproducts.ts` will need updating or a new paginated variant to support the pagination UI (task 11.2)
- All static pages are Server Components with no dynamic data fetching — they inherit Nav + Footer from `app/(page)/layout.tsx` automatically

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1", "5.1"] },
    { "id": 2, "tasks": ["3.2", "4.1", "4.2", "6.1"] },
    { "id": 3, "tasks": ["6.2", "7.1", "9.1", "10.1"] },
    { "id": 4, "tasks": ["7.2", "9.2", "10.2", "11.1", "12.1", "12.2", "13.1", "13.2"] },
    { "id": 5, "tasks": ["11.2", "11.3", "12.3", "13.3"] },
    { "id": 6, "tasks": ["15.1", "15.2", "15.3", "15.4", "15.5", "15.6"] },
    { "id": 7, "tasks": ["15.7"] }
  ]
}
```
