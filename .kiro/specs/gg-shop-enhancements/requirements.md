# Requirements Document

## Introduction

This document captures the requirements for a comprehensive set of enhancements to the GG Shop Next.js e-commerce application. The improvements span security (role-based access control, middleware-based route protection), user experience (server-side cart persistence, pagination, toast consolidation, error boundaries), developer quality (image config, SEO metadata, form accessibility), and content (static informational pages). The application uses Next.js App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose, better-auth, Zustand, and Stripe.

## Glossary

- **System**: The GG Shop Next.js application
- **Auth_Middleware**: The Next.js `middleware.ts` file that runs on the Edge before a request reaches a route handler or page
- **Cart_API**: The server-side API routes responsible for persisting and retrieving cart state in MongoDB
- **Cart_Store**: The Zustand store (`store/cartStore.ts`) that manages client-side cart state
- **Super_Admin**: A user whose `role` field equals `"admin"` in the better-auth user record
- **Regular_User**: A user whose `role` field equals `"user"` in the better-auth user record
- **Dashboard**: The set of routes under the `(dashboard)` route group (`/dashboard`, `/add-product`, `/all-products`, `/edit-product`)
- **Product_Error_Boundary**: A React error boundary component that wraps product-fetching sections
- **Toast_System**: The notification system used throughout the app, consolidated to `react-hot-toast`
- **Static_Page**: A Next.js page that renders informational content with no dynamic data fetching

---

## Requirements

### Requirement 1: Role-Based Access Control

**User Story:** As a Super Admin, I want my role to be enforced throughout the application, so that only I can access admin-only features and regular users cannot reach the dashboard.

#### Acceptance Criteria

1. THE System SHALL define exactly two user roles: `"admin"` and `"user"`, stored in the `role` field of the better-auth user record.
2. WHEN a Super Admin is authenticated, THE System SHALL display a link to the Dashboard in the navigation.
3. WHEN a Regular User is authenticated, THE System SHALL not display the Dashboard link in the navigation.
4. WHEN an unauthenticated visitor accesses any Dashboard route, THE Auth_Middleware SHALL redirect the visitor to `/sign-in` before the page renders.
5. WHEN an authenticated Regular User attempts to access any Dashboard route, THE Auth_Middleware SHALL redirect the user to `/` before the page renders.
6. THE Dashboard layout SHALL not contain client-side redirect logic as the sole protection mechanism, and SHALL include fallback server-side role checks in addition to middleware protection.

---

### Requirement 2: Middleware-Based Dashboard Route Protection

**User Story:** As a developer, I want dashboard protection enforced in Next.js middleware, so that unauthenticated users never see a flash of the dashboard UI.

#### Acceptance Criteria

1. THE Auth_Middleware SHALL intercept all requests matching the pattern `/dashboard`, `/add-product`, `/all-products`, and `/edit-product/:path*`.
2. WHEN a request to a protected route arrives without a valid session cookie, THE Auth_Middleware SHALL return a redirect response to `/sign-in`.
3. WHEN a request to a protected route arrives with a valid session cookie belonging to a Regular User, THE Auth_Middleware SHALL return a redirect response to `/`.
4. WHEN a request to a protected route arrives with a valid session cookie belonging to a Super Admin, THE Auth_Middleware SHALL call `NextResponse.next()` to allow the request.
5. THE Auth_Middleware SHALL read the session using the better-auth server API (`auth.api.getSession`) and SHALL NOT rely solely on cookie name inspection.

---

### Requirement 3: Server-Side Cart Persistence

**User Story:** As a logged-in customer, I want my cart to be saved on the server, so that my cart items are available when I switch devices or browsers.

#### Acceptance Criteria

1. THE Cart_API SHALL expose a `GET /api/cart` endpoint that returns the cart items for the currently authenticated user.
2. THE Cart_API SHALL expose a `POST /api/cart` endpoint that replaces the server-side cart for the currently authenticated user with the provided items array.
3. THE Cart_API SHALL expose a `DELETE /api/cart` endpoint that clears all cart items for the currently authenticated user.
4. THE Cart_Store SHALL synchronize with the server cart as a general mechanism whenever the user's authentication state is known to be authenticated, not only on explicit sign-in events.
5. WHEN a logged-in user modifies the cart (add, remove, decrease, clear), THE Cart_Store SHALL sync the updated cart to the server via `POST /api/cart` within 500ms.
6. WHEN a user signs out, THE Cart_Store SHALL clear local cart state and call `DELETE /api/cart` to clear the server-side cart.
7. IF the Cart_API returns an error during sign-in sync, THEN THE Cart_Store SHALL discard local cart items and display a toast notification indicating the sync failed.
8. WHEN an unauthenticated user modifies the cart, THE Cart_Store SHALL persist items to `localStorage` only, with no server sync.

---

### Requirement 4: Image Optimization Configuration

**User Story:** As a developer, I want Cloudinary images to be served through Next.js Image Optimization, so that product images are properly optimized and no console warnings appear.

#### Acceptance Criteria

1. THE System SHALL configure `next.config.ts` to use `images.remotePatterns` instead of the deprecated `images.domains` array.
2. THE System SHALL include a remote pattern entry for `res.cloudinary.com` with protocol `https`.
3. THE System SHALL include a remote pattern entry for `lh3.googleusercontent.com` with protocol `https` (for Google OAuth avatars).
4. THE System SHALL include a remote pattern entry for `fakestoreapi.com` with protocol `https`.
5. WHEN a `next/image` component renders a Cloudinary URL, THE System SHALL not produce a hostname-not-configured error.

---

### Requirement 5: React Error Boundaries for Product Sections

**User Story:** As a customer, I want the products page to remain functional even if a single product fails to render, so that I can still browse and purchase other items.

#### Acceptance Criteria

1. THE System SHALL provide a `Product_Error_Boundary` React component that catches rendering errors from its children.
2. WHEN a child component inside `Product_Error_Boundary` throws an error, THE Product_Error_Boundary SHALL render a fallback UI instead of crashing the entire page.
3. THE fallback UI SHALL display a user-friendly message indicating that some products could not be loaded, and this message MAY also be displayed during normal browsing states such as empty results.
4. THE Product_Error_Boundary SHALL wrap the product grid section on the products listing page.
5. THE Product_Error_Boundary SHALL wrap the `ProductDetailsClient` component on the product detail page.
6. IF an error is caught by `Product_Error_Boundary`, THEN THE System SHALL log the error details to the console for debugging.

---

### Requirement 6: Pagination for Products Listing

**User Story:** As a customer, I want the products page to load quickly even with a large inventory, so that I can browse products without waiting for all items to load at once.

#### Acceptance Criteria

1. THE System SHALL implement server-side pagination for the `GET /api/products` endpoint, accepting `page` (default: 1) and `limit` (default: 12) query parameters.
2. THE `GET /api/products` endpoint SHALL return a response containing `products`, `totalCount`, `page`, and `totalPages` fields.
3. THE products listing page SHALL display a maximum of 12 products per page by default.
4. WHEN a user is on a products page, THE System SHALL display pagination controls showing the current page and total pages.
5. WHEN a user clicks a pagination control, THE System SHALL navigate to the corresponding page and scroll to the top of the product grid.
6. THE System SHALL display pagination controls based on the actual product count from the server response, regardless of any calculated `totalPages` value, and SHALL show controls whenever the actual product count exceeds 12.
7. THE pagination controls SHALL be keyboard-navigable and include appropriate `aria-label` attributes.

---

### Requirement 7: Toast Library Consolidation

**User Story:** As a developer, I want a single toast notification library used throughout the app, so that the bundle size is reduced and notifications are visually consistent.

#### Acceptance Criteria

1. THE System SHALL use `react-hot-toast` as the sole toast notification library.
2. THE System SHALL remove all imports and usages of `react-toastify` from every component and page.
3. THE System SHALL remove `react-toastify` from `package.json` dependencies.
4. WHEN a toast notification is triggered anywhere in the app, THE System SHALL render it using the `react-hot-toast` `Toaster` component already mounted in `app/layout.tsx`.
5. THE System SHALL preserve all existing toast call sites (add to cart, remove from cart, checkout success, auth errors) and replace `toast` calls from `react-toastify` with equivalent `react-hot-toast` calls.

---

### Requirement 8: SEO Metadata for Product Pages

**User Story:** As a store owner, I want product pages to have descriptive metadata, so that search engines and social media platforms can properly index and preview my products.

#### Acceptance Criteria

1. WHEN a user is viewing the products listing page, THE System SHALL export a static `metadata` object with a `title` of `"Shop All Products — GG Shop"` and a `description` summarising the product catalogue.
2. THE product detail page SHALL export a `generateMetadata` async function that returns a `title` containing the product name, a `description` containing the product description, and an `openGraph.images` array containing the product image URL.
3. WHEN `generateMetadata` is called for a product detail page, THE System SHALL fetch the product data and use it to populate the metadata fields.
4. IF the product is not found during `generateMetadata`, THEN THE System SHALL return a fallback metadata object with a generic title and description.
5. THE root layout metadata SHALL remain as the default fallback for pages that do not define their own metadata.

---

### Requirement 9: Form Accessibility — Proper Label Elements

**User Story:** As a user relying on a screen reader, I want form inputs to have visible labels, so that I can understand what information each field requires.

#### Acceptance Criteria

1. THE sign-in form SHALL always include a visible `<label>` element associated via `htmlFor` with each input field (email, password), regardless of whether the form is currently active or focused.
2. THE sign-up form SHALL include a visible `<label>` element associated via `htmlFor` with each input field (name, email, password) when the sign-up form is displayed.
3. WHEN a `<label>` is rendered, THE System SHALL associate it with its input using matching `htmlFor` and `id` attribute values.
4. THE placeholder attributes on sign-in and sign-up inputs SHALL remain as supplementary hints and SHALL NOT be removed.
5. THE label elements SHALL be visually styled to match the existing design language (uppercase, tracking-widest, small text, gray color).

---

### Requirement 10: Static Informational Pages

**User Story:** As a customer, I want to access informational pages like Contact, Shipping, FAQ, Privacy, and Terms, so that I can find answers to common questions and understand store policies.

#### Acceptance Criteria

1. THE System SHALL create a `/contact` page with a contact form (name, email, message fields) and store address/email information.
2. THE System SHALL create a `/shipping` page with shipping policy information including estimated delivery times and return policy.
3. THE System SHALL create a `/faq` page with at least five frequently asked questions and their answers in an accordion or list format.
4. THE System SHALL create a `/privacy` page with a privacy policy covering data collection, usage, and user rights.
5. THE System SHALL create a `/terms` page with terms of service covering purchase terms, refund policy, and acceptable use.
6. ALL static pages SHALL be placed within the `app/(page)/` route group so they inherit the `Nav` layout.
7. THE Footer component SHALL link to all five static pages using the correct routes (`/contact`, `/shipping`, `/faq`, `/privacy`, `/terms`).
8. WHEN a user navigates to any static page, THE System SHALL render the page with appropriate `metadata` (title and description).
