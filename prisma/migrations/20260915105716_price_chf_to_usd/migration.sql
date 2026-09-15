-- Rename the price columns from CHF to USD.
--
-- Written by hand as RENAME rather than the DROP + ADD that `migrate diff`
-- generates: dropping the column would discard every existing price, and an
-- order's stored total is the record of what a customer was actually charged.
-- A rename preserves all of it.
--
-- The VALUES are not converted. Prices are re-entered as dollar amounts; this
-- migration only changes what the column is called.

ALTER TABLE "Product" RENAME COLUMN "priceCHF" TO "priceUSD";
ALTER TABLE "Order" RENAME COLUMN "totalCHF" TO "totalUSD";
ALTER TABLE "OrderItem" RENAME COLUMN "priceCHF" TO "priceUSD";
