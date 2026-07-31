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
| Auth | Simple password gate (middleware + cookie) | Personal use only — skip full OAuth flow |
| Dates | `date-fns` | Small, tree-shakeable |
| Validation | `zod` | Validate API inputs server-side |
| Hosting | Vercel (free tier) — deploy later | Zero-config Next.js deploy |

### Supabase Access Approach
- Tables are created by the migration in `supabase/migrations/`.
- Next.js **API routes** (server-side only) use the service-role key to read/write.
- The service-role key never reaches the browser.

### Environment variables
```
APP_PASSWORD=            # password gate (plain text, personal use)
SUPABASE_URL=            # e.g. https://gnxpovvgxqffarejrqze.supabase.co
SUPABASE_SERVICE_ROLE_KEY=  # service role key (secret, server-side only)
```

## 2. Supabase Tables

### `profile`
| Column | Type |
|---|---|
| id | bigint PK (always 1) |
| name | text |
| currency | text |
| base_monthly_salary | numeric |
| updated_at | timestamptz |

### `income`
| Column | Type |
|---|---|
| id | bigint PK |
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
| date | date |
| category | text |
| description | text |
| amount | numeric |
| type | text (Fixed/Variable) |
| created_at | timestamptz |

### `categories`
| Column | Type |
|---|---|
| name | text PK |
| monthly_budget | numeric null |

### `savings_goals`
| Column | Type |
|---|---|
| month | text PK (YYYY-MM) |
| target_amount | numeric |
| notes | text |

### `fixed_expenses`
| Column | Type |
|---|---|
| id | bigint PK |
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
2. Apply `supabase/migrations/20260731000000_init.sql` in the SQL editor (or via CLI).
3. Drop credentials into `.env.local` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_PASSWORD`).
4. Build the app (phases above).
