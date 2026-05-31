# GN Essentials - Database Schema

Tables

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

Relationships

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
