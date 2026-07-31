# Personal Finance App — Plan

Next.js-based personal finance tracker, lightweight, using Supabase as the database, with graphs for income/expense/savings tracking. **Mobile-only** design, light theme.

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR/API routes in one place |
| Styling | Tailwind CSS | Light theme only, no bulky CSS |
| Charts | Recharts | Lightweight, good defaults |
| State | Server components + API routes | Minimal client state; no Redux overhead |
| DB | Supabase (Postgres) | Real DB, hosted, free tier, RLS |
| Auth | Per-user login (username + SHA-256 password hash in `users` table) + session cookie | Multi-user — each person gets their own account & data |
| Dates | `date-fns` | Small, tree-shakeable |
| Validation | `zod` | Validate API inputs server-side |
| Hosting | Vercel (free tier) — deploy later | Zero-config Next.js deploy |

### Supabase Access Approach
- Tables are created by the migration in `supabase/migrations/`.
- Next.js **API routes** (server-side only) use the service-role key to read/write.
- The service-role key never reaches the browser.

### Environment variables
```
SUPABASE_URL=            # e.g. https://gnxpovvgxqffarejrqze.supabase.co
SUPABASE_SERVICE_ROLE_KEY=  # service role key (secret, server-side only)
```

The password gate is gone. Each user logs in with a username + password
(SHA-256 hash stored in the `users` table) and sees only their own data —
every data table is scoped by `user_id`. Create accounts from the login page
or with `npm run add-user -- <username> <password>`.

## 2. Supabase Tables

### `users`
| Column | Type |
|---|---|
| id | uuid PK |
| username | text unique |
| password_hash | text (SHA-256 of password) |
| created_at | timestamptz |

### `profile`
| Column | Type |
|---|---|
| user_id | uuid PK (FK → users) |
| name | text |
| currency | text |
| base_monthly_salary | numeric |
| updated_at | timestamptz |

### `income`
| Column | Type |
|---|---|
| id | bigint PK |
| user_id | uuid FK → users |
| date | date |
| type | text (Salary/Extra) |
| source | text |
| amount | numeric |
| notes | text |
| created_at | timestamptz |

### `expenses`
| Column | Type |
|---|---|
| id | bigint PK |
| user_id | uuid FK → users |
| date | date |
| category | text |
| description | text |
| amount | numeric |
| type | text (Fixed/Variable) |
| created_at | timestamptz |

### `categories`
| Column | Type |
|---|---|
| user_id | uuid FK → users |
| name | text |
| monthly_budget | numeric null |
| PK | (user_id, name) |

### `savings_goals`
| Column | Type |
|---|---|
| user_id | uuid FK → users |
| month | text (YYYY-MM) |
| target_amount | numeric |
| notes | text |
| PK | (user_id, month) |

### `fixed_expenses`
| Column | Type |
|---|---|
| id | bigint PK |
| user_id | uuid FK → users |
| name | text |
| amount | numeric |
| due_day | int |
| category | text |
| active | boolean |
| created_at | timestamptz |

Recurring items (rent, subscriptions) auto-populate into `expenses` each month.

## 3. Core Features

1. **Profile** — Name, currency, base monthly salary (editable)
2. **Income tracking** — log monthly salary (auto-suggested from profile, editable) + extra/one-off income
3. **Expense tracking** — quick add form (amount, category, date, note, fixed/variable toggle); fixed expenses auto-populate each month (deduped by name+month, on app load); one-off expenses added anytime
4. **Categories** — predefined + custom, optional per-category budget caps
5. **Savings goals** — e.g. "Save ₹5k from ₹15k this month"; progress bar (Income − Expenses vs goal); pace alerts
6. **Dashboard (graphs)** — monthly income vs expense bar chart; category pie/donut; daily spend trend line; savings goal progress gauge
7. **Reports** — month/year picker, monthly summary (total in, total out, net saved)

## 4. App Structure

```
/app
  (auth)/login/          → password page
  (app)/                 → middleware-gated layout with nav
    dashboard/           → main graphs & summary
    income/              → add/view income
    expenses/            → add/view expenses
    savings/             → set & track goals
    profile/             → user settings
    reports/             → historical view
  api/
    auth/route.ts        → POST (login) / DELETE (logout)
    profile/route.ts     → GET / PUT
    income/route.ts      → GET?month= / POST
    expenses/route.ts    → GET?month= / POST
    categories/route.ts  → GET / POST
    savings/route.ts     → GET?month= / POST
    summary/route.ts     → aggregated dashboard payload (server-computed)
/lib
  db.ts                  → Supabase client + helpers (getIncome, addExpense, etc.)
  supabase.ts            → lazy Supabase client (service role)
  calculations.ts        → savings %, category totals, trend calc
  auth.ts                → cookie helpers
  constants.ts           → default categories
/components
  charts/                → Recharts wrapper components (bar, pie, line, gauge)
  forms/                 → AddExpenseForm, AddIncomeForm, GoalForm, ProfileForm
  layout/                → Nav, MonthPicker
/scripts
  seed.ts                → optional dev seed data
/supabase/migrations     → schema SQL
```

All Supabase calls happen **server-side only**, via API routes.

## 5. Build Phases

### Phase 1 — Foundation
- Scaffold Next.js app
- `lib/db.ts` client + row helpers
- `.env.example` + Supabase setup checklist
- Smoke test read/write against the real DB

### Phase 2 — Auth + Data Entry
- Password gate (middleware + cookie)
- Profile page
- Income form
- Expense form
- Categories management

### Phase 3 — Savings Logic + Fixed Expenses
- Fixed-expense auto-populate engine (on app load, deduped by name+month)
- Savings goal form
- Calculation engine (target vs actual)

### Phase 4 — Dashboard + Reports
- Wire up Recharts: bar, pie, line, progress gauge
- `/api/summary` computes monthly totals server-side
- Reports page with month picker

### Phase 5 — Seed + Polish
- `scripts/seed.ts` with sample data
- Mobile-only layout (max-w-md), light theme only
- Deploy to Vercel (checklist provided; deploy later)

## 6. Decisions

- **Fixed vs recurring expenses**: auto-populate each month on app load (deduped by name+month).
- **Multi-month history**: all data lives in one growing table, filtered by date in-app.
- **Seed data**: yes, for development.
- **Theme**: light only. No dark mode.

## Next Steps

1. Resume the Supabase project if paused (Dashboard → select project → Resume project).
2. Apply the migrations in `supabase/migrations/` (SQL editor or CLI).
3. Drop credentials into `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`).
4. Create accounts from the login page, or `npm run add-user -- <username> <password>`.
