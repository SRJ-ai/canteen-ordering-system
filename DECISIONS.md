# Architecture & Design Decisions

## 1. Monorepo & Framework
- **Decision:** Use Next.js 14 App Router as a full-stack monolithic structure.
- **Reason:** Best suited for React server components, server actions, and fast Vercel deployments. Reduced latency by querying the database directly in Server Components.

## 2. Authentication
- **Decision:** Supabase Auth with Server-Side Cookies.
- **Reason:** Most secure way to prevent XSS and ensure the Next.js server can authorize requests on initial load (avoiding layout shifts). Middleware refreshes the token.

## 3. Database
- **Decision:** PostgreSQL via Supabase, relying heavily on Row Level Security (RLS).
- **Reason:** Moves IDOR prevention and tenant isolation to the database layer. Even if the Next.js API layer fails to check an ID, RLS prevents data leakage. 
- **Exclusions:** Inventory tables were purposefully excluded as per explicit user requirements.

## 4. QR Table System
- **Decision:** Cryptographically secure, non-sequential QR codes for tables.
- **Reason:** Prevents malicious users from guessing table IDs (e.g., `table/1`, `table/2`). A `table_session` cookie securely authenticates the browser session to a physical table to prevent cross-table order manipulation.

## 5. Order Cancellation
- **Decision:** Customers cannot arbitrarily cancel orders post-acceptance. Admins have strict cancellation authority and must provide a reason.
- **Reason:** Canteens start preparing food immediately. Unrestricted cancellation causes wastage and financial loss. All admin cancellations are logged in `audit_logs` and `order_status_history`.

## 6. Payments
- **Decision:** Abstracted Payment Interfaces.
- **Reason:** Allows easy switching between UPI, Stripe, Razorpay, or cash without modifying the core order lifecycle. Payment states (AUTHORIZED, PAID, FAILED) strictly drive the order progression.
