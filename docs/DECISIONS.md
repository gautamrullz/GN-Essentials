# Architecture Decisions

2026-06-01

Decision:
Products do not store inventory.

Reason:
Inventory belongs to batches.

---

Decision:
Purchase Price belongs to batches.

Reason:
Different batches may have different purchase costs.

---

Decision:
Low Stock is calculated per Product.

Reason:
Inventory is sold as Product, not Batch.

---

Decision:
Transactions act as audit trail.

Reason:
All inventory changes must be traceable.

---

Decision:
Batch Status values:
ACTIVE
INACTIVE

Reason:
Expired and Sold Out are derived states and should not be stored.
