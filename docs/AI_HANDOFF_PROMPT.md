# GN Essentials - Complete AI Handoff Prompt

You are helping me build GN Essentials.

Before making recommendations, read and understand the entire context below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project Name:
GN Essentials

Project Type:
Inventory Management System

Current Stage:
MVP Complete

Developer:
Solo Developer (Frontend Background)

Important Instructions:

* Always provide COMPLETE FILES.
* Always mention FILE NAME before code.
* Never provide partial snippets unless explicitly requested.
* Keep TypeScript strict.
* Maintain existing architecture.
* Avoid unnecessary refactoring.
* Keep npm run build passing.
* Reuse existing patterns already present in the project.
* Explain architectural changes before implementing them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend:

* Next.js 16 (App Router)
* React
* TypeScript

Backend:

* Supabase

UI:

* Shadcn UI
* Radix UI
* Tailwind CSS
* Lucide React

Forms:

* React Hook Form
* Zod
* @hookform/resolvers

Notifications:

* Sonner

Utilities:

* clsx
* tailwind-merge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app/
├── login
├── dashboard
│   ├── suppliers
│   ├── categories
│   ├── sub-categories
│   ├── products
│   ├── batches
│   ├── transactions
│   ├── stock-movement
│   ├── alerts
│   │   ├── low-stock
│   │   └── expiry
│   └── reports

components/
├── crud
├── layout
├── suppliers
├── categories
├── sub-categories
├── products
├── batches
└── ui

lib/
├── services
├── validations
├── supabase
├── navigation.ts
└── utils.ts

types/

docs/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE SCHEMA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

suppliers

* id
* name
* phone
* gst_number
* address
* status
* created_at

categories

* id
* name
* created_at

sub_categories

* id
* category_id
* name
* created_at

products

* id
* name
* brand
* category_id
* sub_category_id
* unit_type
* image_url
* low_stock_limit
* status
* created_at
* updated_at

batches

* id
* product_id
* supplier_id
* batch_number
* manufacture_date
* purchase_date
* expiry_date
* quantity
* purchase_price
* selling_price
* status
* created_at

inventory_transactions

* id
* batch_id
* product_id
* transaction_type
* quantity
* notes
* created_at

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE RELATIONSHIPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

categories
└── sub_categories

categories
└── products

sub_categories
└── products

products
└── batches

suppliers
└── batches

products
└── inventory_transactions

batches
└── inventory_transactions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARCHITECTURE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Products are Master Data.

Products contain:

* Name
* Brand
* Category
* Sub Category
* Unit Type
* Low Stock Limit

Products DO NOT contain:

* Quantity
* Stock
* Expiry
* Purchase Price
* Selling Price

Inventory belongs to Batches.

Batches contain:

* Quantity
* Purchase Price
* Selling Price
* Manufacture Date
* Purchase Date
* Expiry Date
* Supplier

Inventory Transactions are the Audit Trail.

Transaction Types:

* PURCHASE
* SALE
* RETURN
* DAMAGE
* WASTAGE
* ADJUSTMENT

Dashboard Rules:

Low Stock:
Calculated per Product using total stock across all batches.

Expiring Soon:
Calculated per Batch.

Inventory Value:
Calculated using:
quantity × purchase_price

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPLETED MODULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Authentication
✅ Login
✅ Protected Dashboard

Master Data
✅ Suppliers CRUD
✅ Categories CRUD
✅ Sub Categories CRUD
✅ Products CRUD

Inventory
✅ Batches CRUD
✅ Transactions History
✅ Stock Movement

Monitoring
✅ Dashboard Metrics
✅ Low Stock Alerts
✅ Expiry Alerts

Reports
✅ Inventory Valuation
✅ Current Stock Report
✅ Expiry Report
✅ Recent Transactions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KNOWN IMPLEMENTATION NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reports Module:

Supabase relation typing and runtime data do not always match.

This currently works:

(batch.products as unknown as { name: string } | null)?.name ?? "Unknown"

Do not refactor unless necessary.

Project currently builds successfully.

npm run build = PASSING

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dashboard

Master Data

* Suppliers
* Categories
* Sub Categories
* Products

Inventory

* Batches
* Transactions
* Stock Movement

Alerts

* Low Stock
* Expiry

Reports

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GN Essentials MVP is complete.

Build Status:
✅ Passing

TypeScript:
✅ Passing

Deployment:
⏳ Not Yet

Testing:
⏳ Not Yet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEXT RECOMMENDED STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Git Push
2. Deploy to Vercel
3. Real-world Testing
4. Bug Fix Round
5. Dashboard Improvements
6. Export Features (Excel/PDF)
7. Advanced Inventory Features

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[REPLACE THIS SECTION WITH THE TASK FOR THE NEW CHAT]
