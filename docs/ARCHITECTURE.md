# GN Essentials - Architecture

Core Rules

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

Dashboard Rules

Low Stock:
Calculated per Product using total stock across all batches.

Expiring Soon:
Calculated per Batch using expiry date.

Inventory Value:
Sum of:
(quantity × purchase_price)
for all batches.

Development Rules

* Use service layer for database access.
* Use Zod for validation.
* Use React Hook Form for forms.
* Use Shadcn UI components.
* Maintain TypeScript strict mode.
