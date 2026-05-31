# GN Essentials - Master AI Prompt

You are helping me build GN Essentials, an Inventory Management System.

Before making recommendations, understand the following project context.

PROJECT OVERVIEW

Project Name:
GN Essentials

Project Type:
Inventory Management System

Tech Stack:

* Next.js 16 (App Router)
* TypeScript
* Supabase
* Shadcn UI
* React Hook Form
* Zod
* Sonner
* Tailwind CSS
* Lucide React

DEVELOPMENT RULES

* Always provide COMPLETE FILES.
* Always mention FILE NAME before code.
* Do not provide partial snippets unless explicitly requested.
* Maintain existing architecture.
* Use TypeScript strict typing.
* Keep npm run build passing.
* Avoid unnecessary refactoring.
* Reuse existing patterns already present in the project.
* Ask for missing schema if required.
* Explain architectural decisions before changing them.

DATABASE

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

RELATIONSHIPS

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

ARCHITECTURE

Products are Master Data.

Products contain:

* Name
* Brand
* Category
* Sub Category
* Unit Type
* Low Stock Limit

Products DO NOT contain:

* Stock
* Quantity
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

Inventory Transactions act as the audit trail.

Transaction Types:

* PURCHASE
* SALE
* RETURN
* DAMAGE
* WASTAGE
* ADJUSTMENT

Dashboard Rules

Low Stock:
Calculated per Product using total stock across all batches.

Expiring Soon:
Calculated per Batch.

Inventory Value:
Calculated using:
quantity × purchase_price

PROJECT STRUCTURE

app/
├── dashboard/
│   ├── suppliers
│   ├── categories
│   ├── sub-categories
│   ├── products
│   ├── batches
│   ├── transactions
│   └── reports

components/
├── crud/
├── suppliers/
├── categories/
├── sub-categories/
├── products/
├── batches/
├── layout/
└── ui/

lib/
├── services/
├── validations/
├── supabase/
├── navigation.ts
└── utils.ts

types/

CURRENT STATUS

Completed

✅ Authentication
✅ Dashboard
✅ Suppliers CRUD
✅ Categories CRUD
✅ Sub Categories CRUD
✅ Products CRUD
✅ Batches CRUD
✅ Transactions History
✅ Dashboard Metrics

Build Status

✅ npm run build passing
✅ TypeScript clean
✅ ESLint clean

WHEN GENERATING CODE

1. Follow existing patterns.
2. Use service layer.
3. Use validation layer.
4. Use React Hook Form.
5. Use Zod.
6. Use Shadcn UI.
7. Maintain TypeScript strict mode.
8. Provide complete files.
9. Mention file name before code.
10. Ensure build remains green.

CURRENT TASK

[REPLACE THIS SECTION WITH YOUR CURRENT TASK]
